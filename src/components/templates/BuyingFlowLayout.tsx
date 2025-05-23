"use client";

import { ReactNode } from "react";
import Header from "../organism/header/Header";
import CheckoutProgressBar from "../molecules/checkoutProgressBar/CheckoutProgressBar";
import { usePetStore } from "@/zustand/store/petDataStore";

export default function BuyingFlowLayout({
  children,
  step,
}: {
  children: ReactNode;
  step: number;
}) {

  const { pets, selectedPetIndex } = usePetStore();
  const petNames = Object.values(pets).map((pet) => pet.name);

  return (
    <>
      <Header isOnlyBrandHeader={true} />
      <main className="mt-3">
        <div className="portrait:min-h-[500px] portrait:h-[98dvh] landscape:min-h-[450px] landscape:h-[calc(95dvh-110px)] landscape:max-h-[800px] flex flex-col items-center justify-start ">
          <div className="container mb-4 text-center  w-full ">
            <CheckoutProgressBar currentStep={step} />
          </div>
          {/* pets name */}
          <ul className="flex items-center gap-5 pt-[5dvh] pb-[3dvh]">
            {petNames.length > 0 ? (
              petNames.map((name, index) => (
                <li 
                  key={index} 
                  className={`font-bold underline ${ index === selectedPetIndex ? "text-[#944446] underline-[#944446]" : ""}`}
                >
                  {name}
                </li>
              ))
            ) : (
              <li className="font-bold">No pets added yet</li>
            )}     
          </ul>
          <div className="container  grow  flex flex-col">{children}</div>
        </div>
      </main>
    </>
  );
}
