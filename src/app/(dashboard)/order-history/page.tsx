"use client";

import React, { useState, useEffect } from "react";
import Typography from "@/components/atoms/typography/Typography";
import OrderHistoryCard from "@/components/molecules/orderHistoryCard/OrderHistoryCard";
import { MealPlanStatus } from "@/components/types/type";
import { ProteinChangePopup } from "@/components/pageSections/dashboard/orderHistory/ProteinChangePopup";
import { DowngradePlanPopup } from "@/components/pageSections/dashboard/orderHistory/DowngradePlanPopup";
import { CancelSubscriptionPopup } from "@/components/pageSections/dashboard/orderHistory/CancelSubscriptionPopup";
import { useUserStore } from "@/zustand/store/userDataStore";
import { useGetSubscriptionDetailsByUserId } from "@/hooks/subscriptionHooks/getSubscriptionDetailsByUserIdHook";
import { useGetSubscriptionDetailsByUserIdAndPetId } from "@/hooks/subscriptionHooks/getSubscriptionDetailsBySubIdAndPetId";
import { useGetInvoiceBySubIdAndPetId } from "@/hooks/subscriptionHooks/getInvoiceDetailsBySubIdAndPetId";
import OrderHistoryCardSkelton from "@/components/skeltons/OrderHistoryCardSkelton";
import { useOrderHistoryStore } from "@/zustand/store/orderHistoryDataStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

export default function OrderHistory() {

  const router = useRouter();

  const { selectedPetFromOrderHistory, selectedPetIndexFromOrderHistory, setSelectedPetIndexFromOrderHistory, setSelectedPetFromOrderHistory } = useOrderHistoryStore();

  const [isProteinPopupOpen, setIsProteinPopupOpen] = useState(false);
  const [isDowngradePlanOpen, setIsDowngradePlanOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [currentProtein, setCurrentProtein] = useState("chicken");
  const [selectedPetIndex, setselectedPetIndex] = useState(0);
  const [selectedPet, setSelectedPet] = useState<PetInfo | null>(null);

  const { userDetails } = useUserStore();
  const userId = userDetails?.userId;
  const { data: subscriptionDetails } = useGetSubscriptionDetailsByUserId(userId);
  const { data: subscriptionDetailsBySubIdAndPetId, refetch: refetchSubscriptionDetails } = useGetSubscriptionDetailsByUserIdAndPetId(userId ?? "", selectedPet?.petId ?? "");
  const { data: invoiceData } = useGetInvoiceBySubIdAndPetId(selectedPet?.subId ?? "", selectedPet?.petId ?? "");

  const dataFromAPI = subscriptionDetailsBySubIdAndPetId?.result;
  const planDataFromAPI = subscriptionDetailsBySubIdAndPetId?.result?.pets[0]?.plan;
  const planStartDateFromAPI = dataFromAPI?.subscriptiondate;
  const planEndDateFromAPI = dataFromAPI?.subscriptionEndDate;
  let formattedStartDate = "DD MM YY";
  let formattedEndDate = "DD MM YY";
  if (typeof planStartDateFromAPI === "string") {
    const [startYear, startMonth, startDay] = planStartDateFromAPI.split("-");
    const startDate = new Date(
      Number(startYear),
      Number(startMonth) - 1,
      Number(startDay)
    );
    formattedStartDate = startDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (typeof planEndDateFromAPI === "string") {
      const [endYear, endMonth, endDay] = planEndDateFromAPI.split("-");
      const endDate = new Date(
        Number(endYear),
        Number(endMonth) - 1,
        Number(endDay)
      );
      formattedEndDate = endDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  } else {
    formattedStartDate = 'Unknown';
    formattedEndDate = 'Unknown';
  }

  const planCardData = {
    regular: {
      activePlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "FOUR WEEKS PLAN - FULL BOWL" : "FOUR WEEKS PLAN - HALF BOWL",
        // subtitle: "FOUR WEEKS PLAN - FULL BOWL",
        planDuration: "4 weeks",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        note: "Change protein for my next order",
        noteDetails: "Order today get new protein from: 24 Apr 2025",
        processingNote: "(We need 5 days to process your request)",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        orderDate: "29 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 300,
        status: "active" as MealPlanStatus,
        hasInvoice: true,
      },
      pausedPlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "FOUR WEEKS PLAN - FULL BOWL" : "FOUR WEEKS PLAN - HALF BOWL",
        // subtitle: "FOUR WEEKS PLAN - FULL BOWL",
        planDuration: "4 weeks",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "29 Mar 2025",
        orderDate: "29 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 300,
        status: "paused" as MealPlanStatus,
        hasInvoice: true,
        pausedDuration: "PAUSED DURATION",
        pausedPeriod: "13 Mar 2025 to 20 Mar 2025",
      },
      cancelledPlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "FOUR WEEKS PLAN - FULL BOWL" : "FOUR WEEKS PLAN - HALF BOWL",
        // subtitle: "FOUR WEEKS PLAN - FULL BOWL",
        planDuration: "4 weeks",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "29 Mar 2025",
        orderDate: "29 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 300,
        status: "cancel" as MealPlanStatus,
        hasInvoice: true,
        cancellationTitle: "CANCELLED PLAN",
        cancellationDate: "13 Mar 2025",
      },
      paymentFailedPlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "FOUR WEEKS PLAN - FULL BOWL" : "FOUR WEEKS PLAN - HALF BOWL",
        // subtitle: "FOUR WEEKS PLAN - FULL BOWL",
        planDuration: "4 weeks",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        note: "Change protein for my next order",
        noteDetails: "Order today get new protein from: 24 Apr 2025",
        processingNote: "(We need 5 days to process your request)",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "29 Mar 2025",
        orderDate: "29 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 300,
        status: "paymentfailed" as MealPlanStatus,
        hasInvoice: true,
      },
    },
    trial: {
      activePlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "ONE WEEK PLAN - FULL BOWL" : "ONE WEEK PLAN - HALF BOWL",
        // subtitle: "ONE WEEK PLAN - FULL BOWL",
        planDuration: "1 week",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "08 Mar 2025",
        orderDate: "08 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 100,
        status: "active" as MealPlanStatus,
        hasInvoice: true,
      },
      endingSoonPlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "ONE WEEK PLAN - FULL BOWL" : "ONE WEEK PLAN - HALF BOWL",
        // subtitle: "ONE WEEK PLAN - FULL BOWL",
        planDuration: "1 week",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "08 Mar 2025",
        orderDate: "08 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 100,
        status: "endingsoon" as MealPlanStatus,
        hasInvoice: true,
      },
      expiredPlan: {
        title: `${dataFromAPI?.pets[0]?.name}'s Meal`,
        // title: "Jackie's Meal",
        subtitle: dataFromAPI?.pets[0]?.plan.bowlSize === "full" ? "ONE WEEK PLAN - FULL BOWL" : "ONE WEEK PLAN - HALF BOWL",
        // subtitle: "ONE WEEK PLAN - FULL BOWL",
        planDuration: "1 week",
        itemName: `${dataFromAPI?.pets[0]?.plan.protein} Bowl`,
        // itemName: "Chicken Bowl",
        planStartDate: `${formattedStartDate}`,
        // planStartDate: "01 Mar 2025",
        planEndDate: `${formattedEndDate}`,
        // planEndDate: "08 Mar 2025",
        orderDate: "08 Mar 2025",
        price: Number(dataFromAPI?.pets[0]?.plan.price),
        // price: 100,
        status: "expired" as MealPlanStatus,
        hasInvoice: true,
      },
    }
  }

  const mealConfig = {
    regular: {
      activeMealConfig: {
        planType: "regular",
        label: "CURRENT MEAL PLAN",
        tagColor: "#2ECC71",
        buttons: ["Downgrade to Half-Bowl", "Pause Plan", "Cancel"],
      },
      pausedMealConfig: {
        planType: "regular",
        label: "PAUSED PLAN",
        tagColor: "#F39C12",
        buttons: ["Restart Plan"],
      },
      cancelledMealConfig: {
        planType: "regular",
        label: "CANCELLED PLAN",
        tagColor: "#E63946",
        buttons: ["Restart Plan"],
      },
      paymentFailedMealConfig: {
        planType: "regular",
        label: "PAYMENT FAILED",
        tagColor: "#E74C3C",
        buttons: ["Update Payment"],
      },
    },
    trial: {
      activeMealConfig: {
        planType: "trial",
        label: "CURRENT MEAL PLAN",
        tagColor: "#2ECC71",
        buttons: []
        // buttons: ["Downgrade to Half-Bowl", "Pause Plan", "Cancel"],
      },
      endingSoonMealConfig: {
        planType: "trial",
        label: "ENDING SOON",
        tagColor: "#F39C12",
        buttons: ["Reorder"],
      },
      expiredMealConfig: {
        planType: "trial",
        label: "EXPIRED PLAN",
        tagColor: "#BDBDBD",
        buttons: ["Reorder"],
      },
    }
  }

  type Pet = { petId?: string; name?: string };
  type SubscriptionRecord = { _id: string; pets?: Pet[] };
  type PetInfo = { name: string; petId: string; subId: string };

  function extractAllPetInfo(data: { result: SubscriptionRecord[] } | undefined): PetInfo[] {
    const petInfo: PetInfo[] = [];

    // Check if data and result exist
    if (data?.result && Array.isArray(data.result)) {
      // Iterate through each record in the result array
      data.result.forEach((record: SubscriptionRecord) => {
        // Check if pets array exists and iterate through it
        if (record.pets && Array.isArray(record.pets)) {
          record.pets.forEach(pet => {
            // Add pet info to the array if both name and petId exist
            if (pet.name && pet.petId) {
              petInfo.push({
                name: pet.name,
                petId: pet.petId,
                subId: record._id,
              });
            }
          });
        }
      });
    }

    return petInfo;
  }

  // Extract all pet info from subscriptionDetails
  const petInfoList = extractAllPetInfo(subscriptionDetails);

  // const petNames = ["Dog1","Dog2","Cat1"];

  // const selectedPetIndex = 0;

  const [prevPetListLength, setPrevPetListLength] = useState(petInfoList.length);

  useEffect(() => {
    if (petInfoList.length > prevPetListLength) {
      // New pet added, select the last one
      const lastIndex = petInfoList.length - 1;
      const lastPet = petInfoList[lastIndex];
      setselectedPetIndex(lastIndex);
      setSelectedPetIndexFromOrderHistory(lastIndex);
      setSelectedPet(lastPet);
      setSelectedPetFromOrderHistory(lastPet);
    }
    setPrevPetListLength(petInfoList.length);
  }, [petInfoList.length]);

  useEffect(() => {
    if (selectedPetIndexFromOrderHistory) {
      setselectedPetIndex(selectedPetIndexFromOrderHistory)
    }
  }, [selectedPetIndexFromOrderHistory]);

  useEffect(() => {
    if (selectedPetFromOrderHistory) {
      setSelectedPet(selectedPetFromOrderHistory);
    }
  }, [selectedPetFromOrderHistory]);

  return (
    <>
      <Typography
        tag="h5"
        text="Orders & History"
        className="capitalize !font-normal mb-6 text-black"
      />

      {
        <div className="pb-6 sm:pb-[7dvh] flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <ul className="flex items-center gap-5  flex-wrap">
            {petInfoList.length > 0 ? (
              petInfoList.map((petData, index) => (
                <li
                  key={index}
                  className={`font-bold cursor-pointer uppercase underline ${index === selectedPetIndex ? "text-[#944446] underline-[#944446]" : ""}`}
                  onClick={() => {
                    // setSubId(petData.subId);
                    // setPetId(petData.petId);
                    setselectedPetIndex(index);
                    setSelectedPetIndexFromOrderHistory(index);
                    setSelectedPet(petData);
                    setSelectedPetFromOrderHistory(petData);
                  }}
                >
                  {petData.name}
                </li>
              ))
            ) : (
              <li className="font-bold">No Subscriptions found</li>
            )}
          </ul>
          <Button 
            variant={'linkSecondary'} 
            className="underline font-normal decoration-1 hover:text-primary-dark max-[576px]:mt-8"
            onClick={(e) => {
              e.preventDefault();
              startTransition(() => {
                router.push("/history");
              })
            }}
          >
            View previous order
          </Button>
        </div>
      }

      <div className="mb-6">
        {
          planDataFromAPI
            ? (
              <>
                {planDataFromAPI?.type === "Regular" && planDataFromAPI?.planStatus === "active" && (
                  <OrderHistoryCard
                    {...planCardData.regular.activePlan}
                    statusLabel={mealConfig.regular.activeMealConfig.label}
                    statusColor={mealConfig.regular.activeMealConfig.tagColor}
                    buttons={mealConfig.regular.activeMealConfig.buttons}
                    planType={mealConfig.regular.activeMealConfig.planType as "regular" | "trial"}
                    // dataFromAPI={dataFromAPI}
                    invoiceData={invoiceData}
                    bowlSize={planDataFromAPI?.bowlSize}
                    buttonStatus={planDataFromAPI}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Regular" && planDataFromAPI?.planStatus === "paused" && (
                  <OrderHistoryCard
                    {...planCardData.regular.pausedPlan}
                    statusLabel={mealConfig.regular.pausedMealConfig.label}
                    statusColor={mealConfig.regular.pausedMealConfig.tagColor}
                    buttons={mealConfig.regular.pausedMealConfig.buttons}
                    planType={mealConfig.regular.pausedMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Regular" && planDataFromAPI?.planStatus === "cancel" && (
                  <OrderHistoryCard
                    {...planCardData.regular.cancelledPlan}
                    statusLabel={mealConfig.regular.cancelledMealConfig.label}
                    statusColor={mealConfig.regular.cancelledMealConfig.tagColor}
                    buttons={mealConfig.regular.cancelledMealConfig.buttons}
                    planType={mealConfig.regular.cancelledMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Regular" && planDataFromAPI?.planStatus === "paymentfailed" && (
                  <OrderHistoryCard
                    {...planCardData.regular.paymentFailedPlan}
                    statusLabel={mealConfig.regular.paymentFailedMealConfig.label}
                    statusColor={mealConfig.regular.paymentFailedMealConfig.tagColor}
                    buttons={mealConfig.regular.paymentFailedMealConfig.buttons}
                    planType={mealConfig.regular.paymentFailedMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Trial" && planDataFromAPI?.planStatus === "active" && (
                  <OrderHistoryCard
                    {...planCardData.trial.activePlan}
                    statusLabel={mealConfig.trial.activeMealConfig.label}
                    statusColor={mealConfig.trial.activeMealConfig.tagColor}
                    buttons={mealConfig.trial.activeMealConfig.buttons}
                    planType={mealConfig.trial.activeMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Trial" && planDataFromAPI?.planStatus === "endingsoon" && (
                  <OrderHistoryCard
                    {...planCardData.trial.endingSoonPlan}
                    statusLabel={mealConfig.trial.endingSoonMealConfig.label}
                    statusColor={mealConfig.trial.endingSoonMealConfig.tagColor}
                    buttons={mealConfig.trial.endingSoonMealConfig.buttons}
                    planType={mealConfig.trial.endingSoonMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
                {planDataFromAPI?.type === "Trial" && planDataFromAPI?.planStatus === "expired" && (
                  <OrderHistoryCard
                    {...planCardData.trial.expiredPlan}
                    statusLabel={mealConfig.trial.expiredMealConfig.label}
                    statusColor={mealConfig.trial.expiredMealConfig.tagColor}
                    buttons={mealConfig.trial.expiredMealConfig.buttons}
                    planType={mealConfig.trial.expiredMealConfig.planType as "regular" | "trial"}
                    subId={selectedPet?.subId}
                    petId={selectedPet?.petId}
                    userId={userId}
                    protein={dataFromAPI?.pets[0]?.plan?.protein}
                    petName={dataFromAPI?.pets[0]?.name}
                    petInfoList={petInfoList}
                    setselectedPetIndex={setselectedPetIndex}
                    setSelectedPetIndexFromOrderHistory={setSelectedPetIndexFromOrderHistory}
                    setSelectedPet={setSelectedPet}
                    setSelectedPetFromOrderHistory={setSelectedPetFromOrderHistory}
                    refetchSubscriptionDetails={refetchSubscriptionDetails}
                  />
                )}
              </>
            )
            : <div>
              <OrderHistoryCardSkelton />
            </div>
        }
      </div>

      <ProteinChangePopup
        isOpen={isProteinPopupOpen}
        onClose={() => setIsProteinPopupOpen(false)}
        currentSelection={currentProtein}
        onSave={(protein) => {
          setCurrentProtein(protein);
          // API call to update protein
        }}
      />

      <DowngradePlanPopup
        isOpen={isDowngradePlanOpen}
        onClose={() => setIsDowngradePlanOpen(false)}
        onConfirm={() => {
          // API call to downgrade plan
          setIsDowngradePlanOpen(false);
        }}
      />

      <CancelSubscriptionPopup
        isOpen={isCancelPopupOpen}
        onClose={() => setIsCancelPopupOpen(false)}
        onCancel={(reason) => {
          // API call to cancel with reason
          // setCancelReason(reason);
          console.log(`Cancellation reason: ${reason}`);
        }}
      // cancelReason={cancelReason}
      // setCancelReason={setCancelReason}
      />
    </>
  );
}
