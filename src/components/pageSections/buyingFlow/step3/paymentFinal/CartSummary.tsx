"use client";

import Typography from "@/components/atoms/typography/Typography";
import CardItem from "@/components/molecules/cartItem/CardItem";
import PromoCode from "@/components/molecules/promoCode/PromoCode";
import React, { useState, useEffect } from "react";
import { usePetStore } from "@/zustand/store/petDataStore";
import { useGetAllOffers } from "@/hooks/subscriptionHooks/getAllOffers";

export default function CartSummary() {
  const { pets, setTotalPrice } = usePetStore();
  const { data: offers } = useGetAllOffers();
  const discountPercentage = offers?.result?.[0]?.discount_percent || 0;

  const totalPrice = pets.reduce((sum, pet) => {
    const price = pet.planType === "Regular"
        ? (offers?.result?.[0]?.discount_percent
            ? (Number(pet.planPrice) * (1 - (offers?.result?.[0]?.discount_percent / 100)))
            : Number(pet.planPrice))
        : Number(pet.planPrice) || 0;

    return sum + (typeof price === 'number' && !isNaN(price) ? price : 0);
  }, 0);

  const regularPlanDiscountPrice = pets.reduce((sum, pet) => {
    const price = pet.planType === "Regular"
        ? (offers?.result?.[0]?.discount_percent
            ? (Number(pet.planPrice) * (offers?.result?.[0]?.discount_percent / 100))
            : 0)
        : 0;

    return sum + (typeof price === 'number' && !isNaN(price) ? Number(price.toFixed(3)) : 0);
  }, 0);

  useEffect(() => {
      setProductPrice(
          pets.reduce((sum, pet) => {
              const price = pet.planType === "Regular"
                  ? (offers?.result?.[0]?.discount_percent
                      ? (Number(pet.planPrice) * (1 - (offers?.result?.[0]?.discount_percent / 100)))
                      : Number(pet.planPrice))
                  : Number(pet.planPrice) || 0;
  
              return sum + (typeof price === 'number' && !isNaN(price) ? price : 0);
          }, 0)
      );
  }, [pets, offers]);

  // const totalPrice = pets.reduce((sum, pet) => {
  //   const price = Number(pet.planPrice) || 0;
  //   return sum + price;
  // }, 0);

  const [productPrice, setProductPrice] = useState<number>(totalPrice);

  useEffect(() => {
    setTotalPrice(productPrice);
  },[productPrice])

  return (
    <div className="bg-[#F1F5DB] min-h-min lg:max-h-[95vh] py-[var(--space-15-30)] rounded-2xl border border-[#C5C5C5]">
      <div>
        <Typography
          tag="h5"
          text="Cart Summary"
          className="uppercase text-primary-dark px-[var(--space-30-60)] text-center sm:text-start "
        />
      </div>
      <div className="relative my-12 lg:mt-5">
        {/* Scrollable content */}
        <div className="scroll-container relative z-0 flex flex-col gap-12 sm:gap-0 pr-[var(--space-30-60)] overflow-y-auto lg:max-h-[25vh] pb-2.5 lg:pb-4 my-scrollbar">
          {pets.map((petDetails) => (
            <CardItem
              key={petDetails.id ?? ""}
              petName={petDetails.name ?? ""}
              planType={petDetails.planType ?? ""}
              planPrice={petDetails.planPrice ?? 0}
              protein={petDetails.protein ?? ""}
              discountPercentage={discountPercentage}
            />
          ))}
        </div>

        {/* Top gradient overlay */}
        <div className="pointer-events-none absolute top-0 left-0 w-full h-6 bg-gradient-to-b from-[#F1F5DB] to-transparent z-10" />

        {/* Bottom gradient overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-[#F1F5DB] to-transparent z-10" />
      </div>

      <div className="flex flex-col gap-[var(--space-10-15)] border-y border-[#CAD585] pt-[var(--space-15-30)] pb-[var(--space-10-20)] mx-[var(--space-30-60)]">
        <Typography
          tag="h6"
          text="Promo/referal code"
          className="uppercase text-primary-dark"
        />
        <PromoCode
          totalPrice={totalPrice}
          productPrice={productPrice}
          setProductPrice={setProductPrice}
          discountPercentage={discountPercentage}
          regularPlanDiscountPrice={regularPlanDiscountPrice}
        />
      </div>
      <div className="flex justify-between pt-[var(--space-15-30)] mx-[var(--space-30-60)]">
        <Typography
          tag="h6"
          text="Order total"
          className="caption uppercase text-primary-dark"
        />
        <Typography
          tag="h5"
          text={productPrice.toFixed(3)}
          className="text-primary-dark !font-bold"
        >
          <Typography tag="span" text=" QAR" className="text-primary-dark " />
        </Typography>
      </div>
    </div>
  );
}
