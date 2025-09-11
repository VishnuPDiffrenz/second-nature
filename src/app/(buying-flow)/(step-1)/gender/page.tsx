"use client";

import Typography from "@/components/atoms/typography/Typography";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePetStore } from "@/zustand/store/petDataStore";
import { startTransition } from "react";
import { motion } from 'framer-motion';

// type Gender = "Male" | "Female";

const GenderPage = () => {
  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  const options = ["Male", "Female"];

  const router = useRouter();

  const { pets, selectedPetIndex, setPetDetails } = usePetStore();
  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  const currentPetId = selectedPet ? selectedPet.id : null; // Get the current pet ID
  const selectedPetName = selectedPet ? selectedPet.name : null;
  const selectedPetGender = selectedPet ? selectedPet.gender : "";
  const [gender, setGender] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (gender && currentPetId) {
      setPetDetails(currentPetId, { gender: gender.toLowerCase() as 'male' | 'female' });
      startTransition(() => {
        router.push("/breed");
      })
      // router.push("/breed");
    } else if (selectedPetGender) {
      startTransition(() => {
        router.push("/breed");
      })
      // router.push("/breed");
    } else {
      startTransition(() => {
        router.push("/gender");
      })
      // router.push("/gender");
    }
  };

  useEffect(() => {
    if (selectedPetGender) {
      setGender(selectedPetGender);
    }
  }, [selectedPetGender])

  return (
    <BuyingFlowLayout step={1}>
      <form className="flex-1 flex flex-col">
        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: softEase }} className="h-full  flex-1 flex flex-col justify-center items-center">
          <Typography
            tag="h2"
            text={`${selectedPetName}'s Gender`}
            className="text-primary-dark mb-5 sm:mb-14 text-center capitalize"
          />

          {/* Gender Selector */}
          <div

            className="flex items-center gap-2.5 sm:gap-8   w-full sm:w-[70%] lg:w-[50%] xl:w-[45%] 2xl:w-full max-w-[683px]">
            {options.map((option) => {
              const isSelected = gender.toLowerCase() === option.toLowerCase();
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGender(option)}
                  className={clsx(
                    "flex-1 flex items-center justify-between   h-13 s px-4 sm:px-6 cursor-pointer rounded-full transition-colors duration-200",
                    isSelected
                      ? "bg-green-800 text-white"
                      : "bg-gray-100 text-green-800"
                  )}
                >
                  <Typography
                    tag="span"
                    text={option}
                    className="h6 caption block grow text-left"
                  />
                  <div className="min-w-min  w-[22px] h-[22px]">
                    {isSelected ? (
                      <Image
                        src="/icons/checked-primary-dark.svg"
                        alt="checked"
                        fill
                        className="!static w-full"
                      />
                    ) : (
                      <Image
                        src="/icons/unchecked-default.svg"
                        alt="unchecked"
                        fill
                        className="!static w-full"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="pb-[3dvh] flex  justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh]">
          <Button
            variant={"outlineSecondaryBtn"}
            className="gap-2.5  lg:ml-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push("/dog-or-cat");
              })
              // router.push("/dog-or-cat");
            }}
          >
            <div className="w-5 relative">
              <Image
                src="/icons/arrow-prev-long-primary-dark.svg"
                alt="icon"
                fill
                className="!static w-full object-contain"
              />
            </div>
            Back
          </Button>
          <Button
            className="gap-2.5 lg:ml-auto lg:mr-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out"
            disabled={!gender}
            onClick={handleNext}
          >
            Next
            <div className="w-5 relative">
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
    </BuyingFlowLayout >
  );
};

export default GenderPage;
