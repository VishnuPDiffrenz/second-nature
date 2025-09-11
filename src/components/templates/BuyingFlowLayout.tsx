"use client";

import { ReactNode, startTransition } from "react";
import Header from "../organism/header/Header";
import CheckoutProgressBar from "../molecules/checkoutProgressBar/CheckoutProgressBar";
import { usePetStore } from "@/zustand/store/petDataStore";
import Typography from "../atoms/typography/Typography";
import { X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/zustand/store/authDataStore";

export default function BuyingFlowLayout({
  children,
  step,
}: {
  children: ReactNode;
  step: number;
}) {

  const router = useRouter();
  const pathname = usePathname();
  const isCheckoutPage = pathname.includes("checkout");
  const isLocationPage = pathname.includes("location");
  const { isAuthenticated, isEmailVerified } = useAuthStore();

  if (isLocationPage) {
  } else if (!isAuthenticated && !isEmailVerified) {
    startTransition(() => {
      router.push("/verify-mail");
    });
  }
  
  const { pets, selectedPetIndex, setSelectedPetIndex, removePet } = usePetStore();
  // const petNames = Object.values(pets).map((pet) => pet.name);

  return (
    <>
      <Header isOnlyBrandHeader={true} />
      <main className="sm:mt-[1dvh] ">
        <div className="portrait:min-h-[400px] portrait:h-[calc(100dvh-127px)] landscape:min-h-[430px] landscape:h-[calc(100dvh-140px)] landscape:max-h-[800px] flex flex-col items-center justify-start">
          <div className="container  mb-4 text-center  w-full ">
            <CheckoutProgressBar currentStep={step} />
          </div>
          {/* pets name */}
          { !isCheckoutPage && (
            <ul className={`${pets.length > 0 ? "bg-primary-light" : ""} flex items-center gap-1 lg:gap-2 py-1 lg:py-1.5 px-4 lg:px-7 my-6 lg:my-8 rounded-full`}>
              {pets.length > 0 ? (
                pets.map((pet, index) => (
                  <div
                    key={index}
                    className="relative group px-2 font-bold text-[15px] sm:text-[20px] cursor-pointer"
                  >
                    <Typography
                      tag="p"
                      text={pet.name}
                      className={`${index === selectedPetIndex ? "text-[#944446]  font-bold capitalize" : "text-[#858585]"}`}
                    />

                    {/* <Button
                      type="button"
                      size="icon"
                      aria-label={`Remove ${pet.name}`}
                      className="absolute -top-4 -right-1 px-1 py-0.3 text-[8px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        removePet(pet.id)
                        setSelectedPetIndex(0)
                      }}
                    >
                      X
                    </Button> */}
                    <button
                      aria-label={`Remove ${pet.name}`}
                      className="absolute -top-1 -right-1 cursor-pointer text-secondary-1 font-bold rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        removePet(pet.id)
                        // setSelectedPetIndex(0)
                        // startTransition(() => {
                        if(selectedPetIndex !== null && selectedPetIndex < pets.length - 1) {
                          if(selectedPetIndex === index) {
                            if(selectedPetIndex === 0){
                              setSelectedPetIndex(0)
                            } else {
                              setSelectedPetIndex(selectedPetIndex - 1)
                            }
                            startTransition(() => {
                              router.push("/gender");
                            });
                          } else if (selectedPetIndex > index) {
                            setSelectedPetIndex(selectedPetIndex - 1);
                          } else if (selectedPetIndex < index) {
                            setSelectedPetIndex(selectedPetIndex);
                          } else {
                            setSelectedPetIndex(0)
                            startTransition(() => {
                              router.push("/gender")
                            })
                          }
                        } else {
                          if (selectedPetIndex !== null && selectedPetIndex === index && pets.length === 1) {
                            setSelectedPetIndex(0);
                            startTransition(() => {
                              router.push("/dog-or-cat");
                            });
                          } else if (selectedPetIndex !== null && selectedPetIndex === index && pets.length > 1) {
                            setSelectedPetIndex(index - 1);
                            startTransition(() => {
                              router.push("/add-more-pets");
                            });
                          } else if (selectedPetIndex !== null && selectedPetIndex > index) {
                            setSelectedPetIndex(selectedPetIndex - 1);
                          } else {
                            setSelectedPetIndex(0);
                            startTransition(() => {
                              router.push("/dog-or-cat");
                            });
                          }
                        }

                      }}
                      // onClick={() => {
                      //   removePet(pet.id)
                      //   setSelectedPetIndex(0)
                      //   startTransition(() => {
                      //     router.push("/dog-or-cat")
                      //   })
                      // }}
                    >
                      <X size={12} />
                    </button>
                  </div>

                  // <li 
                  //   key={index} 
                  //   className={`relative px-2 font-bold underline ${ index === selectedPetIndex ? "text-[#944446] underline-[#944446]" : ""}`}
                  // >
                  //   {pet.name}
                  //   <Button
                  //     type="button"
                  //     size={"icon"}
                  //     aria-label={`Remove ${name}`}
                  //     className="absolute -top-4 -right-1 px-1 py-0.5 text-[8px] rounded-full hover:text-[#944446] hover:bg-gray-200 transition"
                  //     onClick={() => removePet(pet.id)}
                  //   >
                  //     X
                  //   </Button>
                  // </li>
                ))
              ) : (
                <Typography
                  tag="p"
                  text=""
                  // text="No pets added yet"
                  className="font-bold"
                />
              )}
            </ul>
          )}
          <div className="container  grow  flex flex-col   relative ">{children}</div>
        </div>
      </main>
    </>
  );
}
