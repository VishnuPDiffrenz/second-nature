"use client";

import { useEffect, useState } from "react";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import Typography from "@/components/atoms/typography/Typography";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { usePetStore } from "@/zustand/store/petDataStore";
import { useGetBreedDetails } from "@/hooks/subscriptionHooks/getBreedDetailsHook";
import { useGetCrossBreedDetails } from "@/hooks/subscriptionHooks/getCrossBreedDetailsHook";
import { startTransition } from "react";
import { motion } from "framer-motion";

export default function Breed() {
  const [showCrossBreed, setShowCrossBreed] = useState<boolean>(false);
  const [iDontKnowBreed, setIDontKnowBreed] = useState<boolean>(false);
  const router = useRouter();

  const { pets, selectedPetIndex, setPetDetails } = usePetStore();
  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  const currentPetId = selectedPet ? selectedPet.id : null; // Get the current pet ID
  const selectedPetName = selectedPet ? selectedPet.name : null;
  const catOrDog = selectedPet ? selectedPet.catOrDog : ""; // Get the current pet type (cat or dog)
  const breed = selectedPet ? selectedPet?.breed : "";
  const crossBreed = selectedPet ? selectedPet?.crossBreed : "";

  const [selectedBreed, setSelectedBreed] = useState(breed);
  const [selectedCrossBreed, setSelectedCrossBreed] = useState(crossBreed);

  const getBreed = catOrDog === "cat" ? "getCatBreed" : "getDogBreed";
  const getCrossBreed =
    catOrDog === "cat" ? "getCatCrossBreed" : "getDogCrossBreed";
  const { data: breedData } = useGetBreedDetails(getBreed);
  const { data: crossBreedData } = useGetCrossBreedDetails(getCrossBreed);
  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  useEffect(() => {
    if (selectedCrossBreed) {
      setShowCrossBreed(true);
    }
  }, []);

  useEffect(() => {
    if (breedData?.result && selectedPet?.breed) {
      // Normalize both the stored value and options for comparison
      const storedBreed = selectedPet?.breed;
      const matchedBreed = breedData.result.find(
        (opt: string) => opt.trim() === storedBreed
      );

      if (matchedBreed) {
        setSelectedBreed(matchedBreed);
      }
    }
  }, [breedData, selectedPet?.breed]);

  useEffect(() => {
    if (crossBreedData?.result && selectedPet?.crossBreed) {
      const matchedCrossBreed = crossBreedData.result.find(
        (opt: string) => opt === (selectedPet.crossBreed ?? "")
      );
      setSelectedCrossBreed(matchedCrossBreed || "");
      setShowCrossBreed(!!matchedCrossBreed);
    }
  }, [crossBreedData, selectedPet?.crossBreed]);

  useEffect(() => {
    if ((selectedBreed || selectedCrossBreed) && iDontKnowBreed) {
      setIDontKnowBreed(false);
    }
  }, [selectedBreed, selectedCrossBreed]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (iDontKnowBreed) {

      if (currentPetId) {
        setPetDetails(currentPetId, {
          breed: "",
          crossBreed: "",
        });
        startTransition(() => {
          router.push("/age");
        });
        // router.push("/age");
      }

      // router.push("/age");
      return;
    }

    if (selectedBreed && currentPetId) {
      setPetDetails(currentPetId, {
        breed: selectedBreed,
        crossBreed: selectedCrossBreed,
      });
      startTransition(() => {
        router.push("/age");
      });
      // router.push("/age");
    }
  };

  const handleCrossBreed = () => {
    setShowCrossBreed(!showCrossBreed);
  };

  const handleIDontKnowBreedRadioSelect = () => {
    setSelectedBreed("");
    setSelectedCrossBreed("");
    setShowCrossBreed(false);
    setIDontKnowBreed(!iDontKnowBreed);
  }

  const handleRemoveCrossBreed = () => {
    setSelectedCrossBreed("");
    setShowCrossBreed(false);
  };

  return (
    <BuyingFlowLayout step={1}>
      <form className="flex-1 flex flex-col">
        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: softEase }}
          className="h-full   flex-1 flex flex-col justify-center lg:justify-center lg:mt-2 items-center"
        >
          <Typography
            tag="h2"
            // text="Jackey’s Breed"
            text={`${selectedPetName}'s Breed`}
            className="text-primary-dark portrait:mb-[5dvh] landscape:mb-[4dvh] capitalize text-center"
          />

          <div className="max-w-[800px] w-[90%] sm:w-[50%] lg:w-[40%]">
            {/* Breed Selector */}
            <Select value={selectedBreed} onValueChange={setSelectedBreed}>
              <SelectTrigger
                variant="roundedEdgeInputLgSecondary"
                className="text-primary-dark data-[placeholder]:text-[#9B9B9B]"
              >
                <SelectValue placeholder="Select a breed" />
              </SelectTrigger>
              <SelectContent className="bg-white border-secondary-1 rounded-2xl">
                {breedData?.result?.map((breed: string) => (
                  <SelectItem
                    key={breed}
                    value={breed}
                    className="px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-white"
                  >
                    {breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Add a cross-breed */}
            {!showCrossBreed && selectedBreed && (
              <Button
                variant={"secondaryBtn"}
                type="button"
                className="w-full mt-3 text-primary-dark"
                onClick={handleCrossBreed}
              >
                Add a cross-breed <Plus className="w-4 h-4" />
              </Button>
            )}

            {showCrossBreed && (
              <Select
                value={selectedCrossBreed}
                onValueChange={setSelectedCrossBreed}
              >
                <SelectTrigger
                  variant="roundedEdgeInputLgSecondary"
                  className="text-primary-dark data-[placeholder]:text-[#9B9B9B] mt-3"
                >
                  <SelectValue placeholder="Select a breed" />
                </SelectTrigger>
                <SelectContent className="bg-white border-secondary-1 rounded-2xl">
                  {crossBreedData?.result?.map((crossBreed: string) => (
                    <SelectItem
                      key={crossBreed}
                      value={crossBreed}
                      className="px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-white"
                    >
                      {crossBreed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Unknown breed */}
            <div className="flex flex-col lg:flex-row gap-2">
              {/* <Button
                type="button"
                variant={"outlineSecondaryBtn"}
                className={`${iDontKnowBreed && "bg-primary-light text-primary-dark"} mx-auto portrait:mt-[3dvh] landscape:mt-[6dvh]`}
                onClick={handleIdontKnowBreed}

              >
                I don’t know the breed
              </Button> */}

              {
                selectedCrossBreed && (
                  <Button
                    type="button"
                    variant={"outlineSecondaryBtn"}
                    className="mx-auto portrait:mt-[3dvh] landscape:mt-[3dvh]"
                    // className="mx-auto lg:portrait:mt-[2dvh] landscape:mt-[6dvh]"
                    onClick={handleRemoveCrossBreed}
                  >
                    Remove cross-breed
                  </Button>
                )
              }
            </div>
            <div 
              className="flex justify-center gap-2.5 mt-4"
            >
              <input
                type="radio"
                className="accent-primary-dark"
                checked={iDontKnowBreed}
                onChange={() => setIDontKnowBreed(!iDontKnowBreed)}
                onClick={handleIDontKnowBreedRadioSelect}
              />
              <div 
                className="cursor-pointer"
                onClick={handleIDontKnowBreedRadioSelect}>
                <Typography
                  tag="text"
                  text="I don’t know the breed"
                  className="text-primary-dark text-center"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="pb-[3dvh] flex  justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh]">
          <Button
            variant={"outlineSecondaryBtn"}
            className="gap-2.5 lg:ml-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push("/gender");
              });
              // router.push("/gender");
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
            disabled={!iDontKnowBreed && !(selectedBreed)}
            // disabled={!iDontKnowBreed && !(selectedBreed && selectedCrossBreed)}
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
    </BuyingFlowLayout>
  );
}
