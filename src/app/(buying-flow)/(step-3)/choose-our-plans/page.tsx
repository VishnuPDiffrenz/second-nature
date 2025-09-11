"use client";

import Typography from "@/components/atoms/typography/Typography";
import PlanCard from "@/components/pageSections/buyingFlow/step3/choosePlan/PlanCard";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FAQS from "@/components/organism/faq/FAQS";
import { usePetStore } from "@/zustand/store/petDataStore";
import { useGetAllPlan } from "@/hooks/subscriptionHooks/getAllPlanHook";
import { useGetAllProtein } from "@/hooks/subscriptionHooks/getAllProteinHook";
import { useGetAllBowl } from "@/hooks/subscriptionHooks/getAllBowlHook";
import { useGetPriceHook } from "@/hooks/subscriptionHooks/getPriceHook";
import PlanCardSkeleton from "@/components/skeltons/PlanCardSkelton";
import { startTransition } from "react";
import NextPet from "@/components/organism/popUp/NextPet";
import { ChevronDown } from "lucide-react";
import { useGetAllOffers } from "@/hooks/subscriptionHooks/getAllOffers";

const faqsData = [
  {
    question: "Why should I feed fresh?",
    answer:
      "We believe pets deserve to thrive, not just survive. With rising obesity, cancer, and diabetes, science shows the undeniable health benefits of fresh food and the risks of commercial pet diets. Whether your pet is picky, dealing with health issues, or perfectly healthy, we’ve seen firsthand how fresh food transforms lives—ours and our customers’.",
  },
  {
    question: "What are the recipes and ingredients?",
    answer:
      "Our meals are made from high-quality, human-grade ingredients, carefully selected to provide balanced nutrition. Each recipe is crafted by pet nutritionists, using real meat, fresh vegetables, and essential nutrients to keep your pet happy and healthy.",
  },
  {
    question: "How do you know what kind of food my pet needs?",
    answer:
      "We personalize meals based on your pet’s breed, age, weight, activity level, and health goals. Our expert-designed quiz helps determine the perfect meal plan tailored to your pet’s unique needs.",
  },
  {
    question: "How does the meal delivery and schedule work?",
    answer:
      "We offer a flexible meal subscription service that delivers fresh meals straight to your door. Choose your schedule, and we ensure your pet never runs out of nutritious food. You can pause, modify, or cancel anytime.",
  },
  {
    question: "How does the meal delivery and schedule work?",
    answer:
      "We offer a flexible meal subscription service that delivers fresh meals straight to your door. Choose your schedule, and we ensure your pet never runs out of nutritious food. You can pause, modify, or cancel anytime.",
  },
  {
    question: "How does the meal delivery and schedule work?",
    answer:
      "We offer a flexible meal subscription service that delivers fresh meals straight to your door. Choose your schedule, and we ensure your pet never runs out of nutritious food. You can pause, modify, or cancel anytime.",
  },
];

export default function Page() {
  const router = useRouter();

  const { data: planData, isLoading: isPlanLoading } = useGetAllPlan();
  const { isLoading: isProteinLoading } = useGetAllProtein();
  const { isLoading: isBowlLoading } = useGetAllBowl();
  const { data: offers } = useGetAllOffers();
  const { mutate } = useGetPriceHook();

  const discountPercentage = offers?.result?.[0]?.discount_percent || 10;

  const isLoading = isPlanLoading || isProteinLoading || isBowlLoading;

  const {
    pets,
    selectedPetIndex,
    noOfPets,
    setPetDetails,
    setSelectedPetIndex,
  } = usePetStore();
  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  const currentPetId = selectedPet ? selectedPet.id : null;
  // const selectedPetName = selectedPet ? selectedPet.name : null;
  const planType = selectedPet ? selectedPet.planType : "Regular";
  const protein = selectedPet ? selectedPet.protein : "chicken";
  const bowlSize = selectedPet ? selectedPet.bowlSize : "full";
  const [selectedPlan, setSelectedPlan] = useState<string>("Regular");
  // const [ selectedPrice, setSelectedPrice ] = useState<number>(0);
  // const [ selectedProtein, setSelectedProtein ] = useState<string>("");
  // const [ selectedBowlSize, setSelectedBowlSize ] = useState<string>("");
  const [regularProtein, setRegularProtein] = useState<string>("chicken");
  const [regularBowlSize, setRegularBowlSize] = useState<string>("full");
  const [trialProtein, setTrialProtein] = useState<string>("");
  const [trialBowlSize, setTrialBowlSize] = useState<string>("");
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [trialPrice, setTrialPrice] = useState<number>(0);
  const [isRegularPriceLoading, setIsRegularPriceLoading] =
    useState<boolean>(false);
  const [isTrialPriceLoading, setIsTrialPriceLoading] =
    useState<boolean>(false);
  const [isNextPetPopUpOpen, setIsNextPetPopUpOpen] = useState<boolean>(false);

  useEffect(() => {
    if (planType === "Regular") {
      setSelectedPlan("Regular");
      setRegularProtein(protein || "");
      setTrialProtein("");
      setRegularBowlSize(bowlSize || "");
      setTrialBowlSize("");
    } else if (planType === "Trial") {
      setSelectedPlan("Trial");
      setRegularProtein("");
      setTrialProtein(protein || "");
      setRegularBowlSize("");
      setTrialBowlSize(bowlSize || "");
    }
  }, [planType, protein, bowlSize]);

  const handleNext = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (
      selectedPlan === "Regular" &&
      regularProtein &&
      regularBowlSize &&
      currentPetId
    ) {
      // setSelectedProtein(regularProtein || "");
      // setSelectedBowlSize(regularBowlSize);
      setPetDetails(currentPetId, {
        planType: selectedPlan,
        planPrice: regularPrice,
        protein: regularProtein,
        bowlSize: regularBowlSize,
      });
      if ((selectedPetIndex ?? 0) < noOfPets - 1) {
        setSelectedPetIndex((selectedPetIndex ?? 0) + 1);
        startTransition(() => {
          router.push("/gender");
          setIsNextPetPopUpOpen(false);
        });
        // router.push("/gender")
      } else {
        startTransition(() => {
          router.push("/add-more-pets");
          setIsNextPetPopUpOpen(false);
        });
        // router.push("/add-more-pets");
      }
      // router.push("/add-more-pets");
    } else if (
      selectedPlan === "Trial" &&
      trialProtein &&
      trialBowlSize &&
      currentPetId
    ) {
      // setSelectedProtein(trialProtein || "");
      // setSelectedBowlSize(trialBowlSize);
      setPetDetails(currentPetId, {
        planType: selectedPlan,
        planPrice: trialPrice,
        protein: trialProtein,
        bowlSize: trialBowlSize,
      });
      if ((selectedPetIndex ?? 0) < noOfPets - 1) {
        setSelectedPetIndex((selectedPetIndex ?? 0) + 1);
        startTransition(() => {
          router.push("/gender");
          setIsNextPetPopUpOpen(false);
        });
        // router.push("/gender")
      } else {
        startTransition(() => {
          router.push("/add-more-pets");
          setIsNextPetPopUpOpen(false);
        });
        // router.push("/add-more-pets");
      }
      // router.push("/add-more-pets");
    }
  };

  useEffect(() => {
    if (selectedPlan === "Regular") {
      setTrialPrice(0);
    } else if (selectedPlan === "Trial") {
      setRegularPrice(0);
    }

    if (
      selectedPlan &&
      ((regularProtein && regularBowlSize) || (trialProtein && trialBowlSize))
    ) {
      if (selectedPlan === "Regular") {
        setTrialPrice(0);
        setIsRegularPriceLoading(true);
      } else if (selectedPlan === "Trial") {
        setRegularPrice(0);
        setIsTrialPriceLoading(true);
      }

      mutate(
        {
          weight: selectedPet?.currentWeight || 0,
          proteinType:
            selectedPlan === "Regular" ? regularProtein : trialProtein,
          activityLevel: selectedPet?.activityLevel || "",
          bowlSize:
            selectedPlan === "Regular" ? regularBowlSize : trialBowlSize,
          planType: selectedPlan,
        },
        {
          onSuccess: (data) => {
            if (selectedPlan === "Regular") {
              setRegularPrice(data?.result?.price);
            } else if (selectedPlan === "Trial") {
              setTrialPrice(data?.result?.price);
            }
            setIsRegularPriceLoading(false);
            setIsTrialPriceLoading(false);
          },
          onError: () => {
            setIsRegularPriceLoading(false);
            setIsTrialPriceLoading(false);
          },
          onSettled: () => {
            setIsRegularPriceLoading(false);
            setIsTrialPriceLoading(false);
          },
        }
      );
    }
  }, [
    selectedPlan,
    regularProtein,
    regularBowlSize,
    trialProtein,
    trialBowlSize,
    selectedPet?.currentWeight,
    selectedPet?.activityLevel,
  ]);

  return (
    <BuyingFlowLayout step={3}>
      <div className="flex flex-col gap-8 lg:gap-5 pb-[100px]">
        <Typography
          tag="h3"
          text="Choose Your Plan"
          className="text-center text-primary-dark capitalize"
        />
        <div
          className="flex items-center justify-center lg:justify-end lg:mr-[9%] cursor-pointer"
          onClick={() => {
            const element = document.getElementById("faq-section");
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <Typography
            tag="p"
            text="View FAQs"
            className="text-center text-secondary-1"
          />
          <ChevronDown className="h-5 w-5 transition-transform text-secondary-1" />
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-[var(--space-20-30)]">
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row justify-center gap-16 lg:gap-[var(--space-20-30)]">
              {planData?.result?.map(
                (plan: { _id: string; plan_type: string; price: number }) => (
                  <PlanCard
                    key={plan._id}
                    heading={`${plan.plan_type} Plan`}
                    description={
                      plan.plan_type === "Regular"
                        ? "Auto-Renews Every 28 Days"
                        : "One-Time Purchase for 7 Days"
                    }
                    price={
                      plan.plan_type === "Regular" ? regularPrice : trialPrice
                    }
                    setPrice={(price) => {
                      if (plan.plan_type === "Regular") {
                        setRegularPrice(price);
                        setTrialPrice(0);
                        // setSelectedPrice(price);
                      } else {
                        setRegularPrice(0);
                        setTrialPrice(price);
                        // setSelectedPrice(price);
                      }
                    }}
                    bgColour={
                      plan.plan_type === "Regular" ? "bg-[#FDFFF0]" : "bg-white"
                    }
                    offerBadge={
                      plan.plan_type === "Regular"
                        ? `Enjoy ${discountPercentage}% Off Your First Month!`
                        : ""
                    }
                    isSelected={selectedPlan === plan.plan_type}
                    protein={
                      plan.plan_type === "Regular"
                        ? regularProtein
                        : trialProtein
                    }
                    setProtein={
                      plan.plan_type === "Regular"
                        ? setRegularProtein
                        : setTrialProtein
                    }
                    bowlSize={
                      plan.plan_type === "Regular"
                        ? regularBowlSize
                        : trialBowlSize
                    }
                    setBowlSize={
                      plan.plan_type === "Regular"
                        ? setRegularBowlSize
                        : setTrialBowlSize
                    }
                    isPriceLoading={
                      plan.plan_type === "Regular"
                        ? isRegularPriceLoading
                        : isTrialPriceLoading
                    }
                    onClick={() => {
                      if (plan.plan_type !== selectedPlan) {
                        if (plan.plan_type === "Regular") {
                          setTrialProtein("");
                          setTrialBowlSize("");
                        } else if (plan.plan_type === "Trial") {
                          setRegularProtein("");
                          setRegularBowlSize("");
                        }
                      }
                      setSelectedPlan(plan.plan_type);
                      // setSelectedPrice(plan.price);
                    }}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="pb-[3dvh] flex justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh]">
          <Button
            variant={"outlineSecondaryBtn"}
            className="gap-2.5  lg:ml-[-55px] hover:scale-105 transition-transform duration-300 ease-in-out"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push("/eating-preference");
              });
              // router.push("/activity");
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
            disabled={
              !(
                (regularProtein && regularBowlSize) ||
                (trialProtein && trialBowlSize)
              )
            }
            // disabled={ !(selectedProtein && selectedBowlSize) }
            // onClick={handleNext}
            onClick={() => {
              if ((selectedPetIndex ?? 0) < noOfPets - 1) {
                setIsNextPetPopUpOpen(true);
              } else {
                handleNext();
              }
            }}
          >
            {(selectedPetIndex ?? 0) < noOfPets - 1 ? "Next" : "Checkout"}
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
        {isNextPetPopUpOpen && (
          <NextPet
            setIsNextPetPopupOpen={setIsNextPetPopUpOpen}
            handleNext={handleNext}
          />
        )}
        <div id="faq-section" className="flex flex-col gap-7 lg:gap-8 mt-[100px]">
          <Typography
            tag="h3"
            text="Frequently Asked "
            className="text-center text-primary-dark"
          >
            <br />
            <Typography
              tag="span"
              text="Questions"
              />
          </Typography>

          <div className="lg:mx-48">
            <FAQS faqs={faqsData} defaultOpenIndex={0} />
          </div>
        </div>
      </div>

      {/* <NextPet/> */}
    </BuyingFlowLayout>
  );
}
