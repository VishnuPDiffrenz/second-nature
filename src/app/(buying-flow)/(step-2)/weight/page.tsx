"use client";

import Typography from "@/components/atoms/typography/Typography";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import React,{ useState, useEffect } from "react";
import Counter from "@/components/molecules/counterBuyingFlow/Counter";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePetStore } from "@/zustand/store/petDataStore";
import { startTransition } from "react";
import { motion } from 'framer-motion';

export default function Page() {

  const router = useRouter();

  const { pets, selectedPetIndex, setPetDetails } = usePetStore();
  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  const currentPetId = selectedPet ? selectedPet.id : null; // Get the current pet ID
  const selectedPetName = selectedPet ? selectedPet.name : null;
  const currentWeightFromStore = selectedPet ? selectedPet.currentWeight : 0;
  const targetWeightFromStore = selectedPet ? selectedPet.targetWeight : 0;

  const [ currentWeight, setCurrentWeight ] = useState(currentWeightFromStore);
  const [ targetWeight, setTargetWeight ] = useState(targetWeightFromStore);

  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentWeight && targetWeight && currentPetId) {
      setPetDetails(currentPetId, { currentWeight: currentWeight, targetWeight: targetWeight });
      startTransition(() => {
        router.push("/activity");
      })
      // router.push("/activity");
    }
  }

  useEffect(() => {
    if(currentWeightFromStore){
      setCurrentWeight(currentWeightFromStore);
    }
    if(targetWeightFromStore){
      setTargetWeight(targetWeightFromStore);
    }
  },[currentWeightFromStore, targetWeightFromStore])

  return (
    <BuyingFlowLayout step={2}>

         <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: softEase }} className="flex flex-1 flex-col items-center lg:justify-center gap-8 bg-white">
          <Typography 
            tag="h3" 
            // text="Jackey’s Weight and Target Weight"
            text={`${selectedPetName}'s Weight and Target Weight`}
            className="text-center text-primary-dark capitalize" 
          />
          <div className="w-full mx-auto items-center justify-center flex flex-col lg:flex-row gap-4">
          <Counter label="Weight (Kg)" min={0} max={1000} step={0.1} value={currentWeight} setValue={setCurrentWeight} />
          <Counter label="Target Weight (Kg)" min={0} max={1000} step={0.1} value={targetWeight} setValue={setTargetWeight} />
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="pb-[3dvh] flex justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh]">
          <Button
            variant={"outlineSecondaryBtn"}
            className="gap-2.5  lg:ml-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push("/age");
              })
              // router.push("/age");
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
            disabled={!currentWeight || !targetWeight}
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