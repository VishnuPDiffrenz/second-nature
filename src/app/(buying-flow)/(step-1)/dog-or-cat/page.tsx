"use client";
import { useState, useEffect } from "react";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Typography from "@/components/atoms/typography/Typography";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { usePetStore } from "@/zustand/store/petDataStore";
import { startTransition } from "react";
import { motion } from "framer-motion";

export default function DogOrCat() {
  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  const router = useRouter();

  const {
    noOfPets,
    selectedPetIndex,
    setCurrentPet,
    setPetDetails,
    addNewPet,
    setSelectedPetIndex,
  } = usePetStore();

  useEffect(() => {
    setSelectedPetIndex(selectedPetIndex || 0); // Reset selected pet index
  }, [setSelectedPetIndex]);

  const [petType, setPetType] = useState<"dog" | "cat" | "">("");
  const [petName, setPetName] = useState("");
  const [catName, setCatName] = useState("");
  const [dogName, setDogName] = useState("");

  const handlePetSelection = (type: "dog" | "cat") => {
    setPetType(type);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPetName(e.target.value);
    if (petType === "dog") {
      setDogName(e.target.value);
    } else if (petType === "cat") {
      setCatName(e.target.value);
    }
  };

  // const handleAddMorePets = () => {
  //   if (petType && petName.trim() !== "") {
  //     const newPetId = addNewPet({
  //       catOrDog: petType,
  //       name: petType === "dog" ? dogName : catName,
  //     });
  //     setCurrentPet(newPetId);
  //     setPetType("");
  //     setPetName("");
  //     setDogName("");
  //     setCatName("");
  //   }
  // };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (petType && petName.trim() !== "") {
      const newPetId = addNewPet({
        catOrDog: petType,
        name: petType === "dog" ? dogName : catName,
      });
      setCurrentPet(newPetId);
      if (newPetId) {
        setPetDetails(newPetId, {
          catOrDog: petType,
          name: petType === "dog" ? dogName : catName,
        });
        // setPetType("");
        // setPetName("");
      }
    }

    if (noOfPets > 0) {
      if (selectedPetIndex === noOfPets) {
        if (petType && petName.trim() !== "") {
          setSelectedPetIndex(selectedPetIndex);
          startTransition(() => {
            router.push("/gender");
          });
          // router.push("/gender");
        } else {
          setSelectedPetIndex(selectedPetIndex - 1);
          startTransition(() => {
            router.push("/add-more-pets");
          });
          // router.push("/add-more-pets");
        }
      } else {
        setSelectedPetIndex(selectedPetIndex);
        startTransition(() => {
          router.push("/gender");
        });
        // router.push("/gender");
      }
    } else {
      setSelectedPetIndex(0); // Reset selected pet index
      startTransition(() => {
        router.push("/gender");
      });
      // router.push("/gender");
    }

    setPetType("");
    setPetName("");
    setDogName("");
    setCatName("");

  };

  const isNextDisable = !(petType && petName.trim() !== "");

  return (
    <BuyingFlowLayout step={1}>
      <form action="" className="flex-1 flex flex-col ">
        {/* content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: softEase }}
          className="flex-1 sm:h-full flex flex-col sm:flex-row items-center justify-center w-full max-w-3xl mx-auto gap-0 sm:gap-8 ">
          {/* Dog Selection */}
          <div className="flex flex-col w-[70%] lg:w-[30%] xl:w-[35%] 2xl:w-full max-w-[381px] ">
            <div
              className={`relative  rounded-2xl h-[16dvh] sm:h-[36dvh]  mx-auto w-auto max-w-[300px] max-h-[350px] cursor-pointer overflow-hidden `}
              onClick={() => handlePetSelection("dog")}
            >
              <Image
                src="/images/dog-or-cat-section-dog-thumb.webp"
                alt="Brown dog with white chest"
                fill
                className="!static w-full h-full object-contain"
              />
            </div>

            <div
              className=" sm:mt-2 relative bg-white w-full"
              onClick={(e) => {
                e.preventDefault();
                handlePetSelection("dog");
              }}
            >
              <div
                className={`${petType === "dog" ? "border-secondary-1" : "border-gray-300"
                  } flex items-center pr-1.5 lg:pr-3 w-full border rounded-full text-center`}
              >
                <Input
                  type="text"
                  value={petType === "dog" ? dogName : ""}
                  onChange={handleNameChange}
                  // disabled={petType !== "dog"}
                  variant={"roundedEdgeInputLg"}
                  className={`w-full border-0 text-start  font-semibold  placeholder-[#7C7C7C] placeholder:font-medium focus:placeholder-slate-300 !pr-0`}
                  placeholder="Type Your Dogs’s Name"
                />
                {petType === "dog" && (
                  <div className="w-8 h-8  rounded-full p-1">
                    <Image
                      src="/icons/checked.svg"
                      alt="Dog"
                      fill
                      className="!static w-fit h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Or divider */}
          <Typography tag="span" text="Or" className="!text-[#A1A1A1] block my-[0.8dvh] sm:my-0" />

          {/* Cat Selection */}
          <div className="flex flex-col w-[70%] lg:w-[30%] xl:w-[35%] 2xl:w-full max-w-[381px]">
            <div
              className={`relative  rounded-2xl h-[16dvh] sm:h-[36dvh]  mx-auto w-auto max-w-[300px] max-h-[350px] cursor-pointer overflow-hidden `}
              onClick={() => handlePetSelection("cat")}>

              <Image
                src="/images/dog-or-cat-section-cat-thumb.webp"
                alt="Cat"
                fill
                className="!static w-full h-full object-contain"
              />


            </div>

            <div
              className="sm:mt-2 w-full relative bg-white"
              onClick={(e) => {
                e.preventDefault();
                handlePetSelection("cat");
              }}
            >
              <div
                className={`${petType === "cat" ? "border-secondary-1" : "border-gray-300"
                  } flex items-center pr-1.5 lg:pr-3 w-full border rounded-full text-center`}
              >
                <Input
                  type="text"
                  value={petType === "cat" ? catName : ""}
                  onChange={handleNameChange}
                  // disabled={petType !== "cat"}
                  placeholder="Type Your Cat's Name"
                  variant={"roundedEdgeInputLg"}
                  className={`w-full border-0 text-start  font-semibold  placeholder-[#7C7C7C] placeholder:font-medium focus:placeholder-slate-300 !pr-0`}
                />
                {petType === "cat" && (
                  <div className="w-8 h-8  rounded-full p-1">
                    <Image
                      src="/icons/checked.svg"
                      alt="Brown dog with white chest"
                      fill
                      className="!static w-fit h-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* {isNextDisable ? (
          ""
        ) : (
          <Button
            variant={"linkPrimaryDark"}
            className="justify-start mx-auto mt-[2.5dvh]  disabled:!opacity-100 disabled:!bg-transparent disabled:!text-primary-dark"
            disabled={!petType || !petName.trim()}
            onClick={(e) => {
              e.preventDefault();
              handleAddMorePets();
            }}
          >
            Add More Pets
            <div className="w-4">
              <Image
                src="/icons/add-primary-dark.svg"
                alt="Add new shipping address"
                fill
                className="!static w-full object-contain"
              />
            </div>
          </Button>
        )} */}

        {/* navigation */}
        <div className="pb-[3dvh] flex flex-col lg:flex-row items-center gap-4 lg:gap-0  lg:items-end pt-[3dvh] ">
          <Button
            className="gap-2.5 lg:absolute lg:right-[-55px] lg:transform hover:scale-105 transition-transform duration-300 ease-in-out"
            disabled={isNextDisable}
            onClick={handleNext}
          >
            Next
            <div className="w-5">
              <Image
                src="/icons/arrow-next-long.svg"
                alt="icon"
                fill
                className="!static w-full object-contain"
              />
            </div>
          </Button>
        </div>
      </form>
    </BuyingFlowLayout>
  );
}
