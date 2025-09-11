"use client";
import Typography from "@/components/atoms/typography/Typography";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import { useState, useEffect } from "react";
import PetActiveCard from "@/components/molecules/petActiveCard/PetActiveCard";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePetStore } from "@/zustand/store/petDataStore";
import { startTransition } from "react";
import { motion } from 'framer-motion';

export default function Page() {

  const router = useRouter();

  const { pets, selectedPetIndex, setPetDetails } = usePetStore();
  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  const currentPetId = selectedPet ? selectedPet.id : null;
  const selectedPetName = selectedPet ? selectedPet.name : null;
  const activityLevel = selectedPet ? selectedPet.activityLevel : "";
  const dogOrCat = selectedPet?.catOrDog;

  const [selectedActivity, setSelectedActivity] = useState("");

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedActivity && currentPetId) {
      setPetDetails(currentPetId, { activityLevel: selectedActivity })
      startTransition(() => {
        router.push("/any-allergies");
        // router.push("/choose-our-plans");
      })
      // router.push("/choose-our-plans");
    }
  }

  useEffect(() => {
    if (activityLevel) {
      setSelectedActivity(activityLevel);
    }
  },[activityLevel])

  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  return (
    <BuyingFlowLayout step={2}>

       <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: softEase }} className="flex flex-col flex-1 items-center lg:justify-center gap-8 bg-white">
        <Typography
          tag="h3"
          // text="How active is Jackey?"
          text={`How active is ${selectedPetName}?`}
          className="text-center text-primary-dark capitalize"
        />
        <div className="w-full mx-auto items-center justify-center flex flex-wrap gap-3 lg:gap-[var(--space-20-60)] ">
          <PetActiveCard
            image={dogOrCat === "dog" ? "/images/sedentary.webp" : "/images/catSedentary.webp"}
            // image="/images/sedentary.webp"
            text="SEDENTARY"
            selectedPet={selectedActivity === "sedentary"}
            setSelectedCharacter={() => setSelectedActivity("sedentary")}
          />
          <PetActiveCard
            image={dogOrCat === "dog" ? "/images/less-acive.webp" : "/images/catLessActive.webp"}
            // image="/images/less-acive.webp"
            text="LESS-ACTIVE"
            selectedPet={selectedActivity === "lessActive"}
            setSelectedCharacter={() => setSelectedActivity("lessActive")}
          />
          <PetActiveCard
            image={dogOrCat === "dog" ? "/images/active-pet.webp" : "/images/catActive.webp"} 
            // image="/images/active-pet.webp"
            text="ACTIVE"
            selectedPet={selectedActivity === "active"}
            setSelectedCharacter={() => setSelectedActivity("active")}
          />
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="pb-[3dvh] flex justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh] ">
        <Button
          variant={"outlineSecondaryBtn"}
          className="gap-2.5  lg:absolute lg:left-[-55px]  hover:scale-105 transition-transform duration-300 ease-in-out"
          onClick={(e) => {
            e.preventDefault();
            startTransition(() => {
              router.push("/weight");
            })
            // router.push("/weight");
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
          className="gap-2.5 lg:absolute lg:right-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out" 
          disabled={!selectedActivity}
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

    </BuyingFlowLayout>
  );
}
