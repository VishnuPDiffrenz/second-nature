import React,{ useState } from "react";
import { OrderHistoryCardPropsType } from "@/components/types/type";
import BadgeTitle from "@/components/atoms/badgeTitle/BadgeTitle";
import Typography from "@/components/atoms/typography/Typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProteinChangePopup } from "@/components/pageSections/dashboard/orderHistory/ProteinChangePopup";
import { DowngradePlanPopup } from "@/components/pageSections/dashboard/orderHistory/DowngradePlanPopup";
import { CancelSubscriptionPopup } from "@/components/pageSections/dashboard/orderHistory/CancelSubscriptionPopup";
import { useChangeProtein } from "@/hooks/subscriptionHooks/changeProteinHook";
import { useDowngradePlan } from "@/hooks/subscriptionHooks/downgradePlanHook";
import { useUpgradePlan } from "@/hooks/subscriptionHooks/upgradePlanHook";
import { useCancelPlan } from "@/hooks/subscriptionHooks/cancelPlanHook";
import { useRestartPlan } from "@/hooks/subscriptionHooks/restartPlanHook";
import { useOrderHistoryStore } from "@/zustand/store/orderHistoryDataStore";
import { useGetSubscriptionDetailsByUserIdAndPetId } from "@/hooks/subscriptionHooks/getSubscriptionDetailsBySubIdAndPetId";
import { useCreateSubscriptionHook } from "@/hooks/subscriptionHooks/createSubscriptionHook";
import { useGetInvoiceBySubIdAndPetId } from "@/hooks/subscriptionHooks/getInvoiceDetailsBySubIdAndPetId";
import { useUserStore } from "@/zustand/store/userDataStore";
import { PauseDeliveriesPopup } from "@/components/pageSections/dashboard/orderHistory/PauseDeliveriesPopup";
import { usePausePlan } from "@/hooks/subscriptionHooks/pausePlanHook";
import { toast } from "sonner";
import CancelSub from "@/components/organism/popUp/CancelSub";

type PetInfo = { name: string; petId: string; subId: string };

const OrderHistoryCard: React.FC<
  OrderHistoryCardPropsType & {
    statusLabel: string;
    statusColor: string;
    buttons: string[];
    planType: "regular" | "trial";
    invoiceData?: { filePath: string };
    bowlSize?: string;
    buttonStatus?: {
      isDowngrade: boolean;
      isUpgrade: boolean;
      isChangeprotein: boolean;
    };
    subId?: string;
    petId?: string;
    userId?: string;
    protein?: string;
    petName?: string;
    petInfoList?: PetInfo[];
    setselectedPetIndex?: (index: number) => void;
    setSelectedPetIndexFromOrderHistory?: (index: number) => void;
    setSelectedPet?: (pet: PetInfo) => void;
    setSelectedPetFromOrderHistory?: (pet: PetInfo) => void;
    refetchSubscriptionDetails?: () => void;
  }
> = ({
  title,
  subtitle,
  // planDuration,
  itemName,
  planStartDate,
  planEndDate,
  // orderDate,
  price,
  note,
  // noteDetails,
  processingNote,
  hasInvoice,
  pausedDuration,
  pausedPeriod,
  cancellationTitle,
  cancellationDate,
  statusLabel,
  statusColor,
  buttons,
  status,
  planType,
  // invoiceData,
  bowlSize,
  buttonStatus,
  protein,
  subId,
  petId,
  userId,
  // petName,
  petInfoList,
  setselectedPetIndex,
  setSelectedPetIndexFromOrderHistory,
  setSelectedPet,
  setSelectedPetFromOrderHistory,
  refetchSubscriptionDetails,
}) => {

  const { userDetails } = useUserStore();
  const userIdFromStore = userDetails?.userId;
  const { selectedPetFromOrderHistory } = useOrderHistoryStore();
  const subIdFromStore = selectedPetFromOrderHistory?.subId ?? "";
  const petIdFromStore = selectedPetFromOrderHistory?.petId ?? "";
  const { data: subscriptionDetails } = useGetSubscriptionDetailsByUserIdAndPetId(userIdFromStore ?? "", petIdFromStore ?? "");
  const userIdFromAPI = subscriptionDetails?.result?.user_id ?? "";
  const accountFromAPI = subscriptionDetails?.result?.account ?? "";
  const shippingDetailsFromAPI = subscriptionDetails?.result?.shippingDetails ?? "";
  const billingDetailsFromAPI = subscriptionDetails?.result?.billingDetails ?? "";
  // const subscriptionDateFromAPI = subscriptionDetails?.result?.subscriptiondate ?? "";
  const promoCodeFromAPI = subscriptionDetails?.result?.promocode ?? "";
  const subscribeToOffersFromAPI = subscriptionDetails?.result?.subscribeToOffers ?? true;
  const petsFromAPI = subscriptionDetails?.result?.pets ?? [];
  const paymentFromAPI = subscriptionDetails?.result?.payment ?? "";
  // const isDeletedFromAPI = subscriptionDetails?.result?.isDeleted ?? false;
  const cancellationDateFromAPI = subscriptionDetails?.result?.lastChange?.Date;
  const pauseStartDateFromAPI = subscriptionDetails?.result?.lastChange?.startDate;
  const pauseEndDateFromAPI = subscriptionDetails?.result?.lastChange?.endDate;
  const nextPausePossibleDeliveryDateFromAPI = subscriptionDetails?.result?.nextPausePossibleDeliveryDate;

  function formatDate(dateString: string) {
    if (!dateString) return "";
    
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = parsedDate.toLocaleString('en-GB', { month: 'short' });
    const year = parsedDate.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const formattedCancellationDate = formatDate(cancellationDateFromAPI);
  const formattedPauseStartDate = formatDate(pauseStartDateFromAPI);
  const formattedPauseEndDate = formatDate(pauseEndDateFromAPI);
  const formattedPossiblePauseDate = formatDate(nextPausePossibleDeliveryDateFromAPI);

  const proteinImageSrc = protein === "lamb"
    ? "/icons/card-lamb.svg"
    : protein === "beef"
    ? "/icons/card-beef.svg"
    : "/icons/card-chicken.svg";

  const [isProteinPopupOpen, setIsProteinPopupOpen] = useState(false);
  const [isDowngradePopupOpen, setIsDowngradePopupOpen] = useState(false);
  const [isCancelSubPopupOpen, setIsCancelSubPopupOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isPausePopupOpen, setIsPausePopupOpen] = useState(false);
  const [currentProtein, setCurrentProtein] = useState(protein);
  const [changeProteinError, setChangeProteinError] = useState("");
  const [planChangeError, setPlanChangeError] = useState("");
  const [planChangeReason, setPlanChangeReason] = useState("");
  const [restartPlanPaymentError, setRestartPlanPaymentError] = useState("");
  const [upgradePlanPaymentError, setUpgradePlanPaymentError] = useState("");

  const { mutate: changeProtein, isPending: isChangeProteinPending } = useChangeProtein();
  const { mutate: downgradePlan, isPending: isDowngradeLoading } = useDowngradePlan();
  const { mutate: upgradePlan } = useUpgradePlan();
  const { mutate: cancelPlan } = useCancelPlan();
  const { mutate: restartPlan } = useRestartPlan();
  const { mutate: createSubscription } = useCreateSubscriptionHook();
  const { mutate: pausePlan } = usePausePlan();
  const { data: invoiceDataFromAPI } = useGetInvoiceBySubIdAndPetId(subIdFromStore, petIdFromStore);

  const handleChangeProtein = (subId: string, petId: string, userId: string, proteinType: string) => {
    changeProtein(
      { 
        subId,
        petId, 
        userId, 
        proteinType
      },
      {
        onSuccess: (data) => {
          setCurrentProtein(protein);
          setIsProteinPopupOpen(false);
          setChangeProteinError("");
          if( data.statusCode === 200) { 
            toast.success(data.message);
          } else {
            toast.error(data.message); // Uncomment if you want to show a toast notification
          }
          refetchSubscriptionDetails?.();
        },
        onError: (error) => {
          setCurrentProtein(protein);
          if (error instanceof Error) {
            toast.error(error.message || "Error in protein change");
          }
        }
      }
    );
  }

  const handleDowngrade = () => {
    if (subId && petId && userId) {
      downgradePlan(
        { 
          subId, 
          petId, 
          userId,
          downgradeReason: planChangeReason,
        },
        {
          onSuccess: (data) => {
            setIsDowngradePopupOpen(false);
            setPlanChangeError("");
            if(data.statusCode === 200) {
              toast.success(data.message);
              refetchSubscriptionDetails?.();
            }else{
              toast.error(data.message);
            }
          },
          onError: (error) => {
            if (error instanceof Error) {
              toast.error(error.message || "Error in downgrade plan");
            }
          }
        }
      );
    } else {
      console.error("subId, petId, or userId is undefined");
    }
  }

  const handleUpgrade = () => {
    if (subId && petId && userId) {
      upgradePlan(
        { 
          subId, 
          petId, 
          userId, 
          upgradeReason: planChangeReason,
        },
        {
          onSuccess: (data) => {
            setIsDowngradePopupOpen(false);
            setPlanChangeError("");
            if(data.statusCode === 200) {
              toast.success(data.message);
              refetchSubscriptionDetails?.();
            } else if(data.statusCode === 402) {
              setUpgradePlanPaymentError(data.message || "Payment required for plan upgrade");
            }
            else{
              toast.error(data.message);
            }
          },
          onError: (error) => {
            if (error instanceof Error) {
              toast.error(error.message || "Error in upgrade plan");
            }
          }
        }
      );
    } else {
      toast.error("subId, petId, or userId is undefined");
    }
  }

  const handleCancel = (reason: string) => {
    if (subId && petId && userId) {
      cancelPlan(
        {
          subId,
          petId,
          userId,
          formData: {
            // cancelReason: cancelReason
            cancelReason: reason
          }
        },
        {
          onSuccess: (data) => {
            setIsCancelPopupOpen(false);
            if (data.statusCode === 200) {
              toast.success(data.message); 
              refetchSubscriptionDetails?.();
            } else {
              toast.error(data.message);
            }
          },
          onError: (error: unknown) => {
            if (error instanceof Error) {
              toast.error(error.message || "Error in cancel plan");
            }
          }
        }
      );
    } else {
      toast.error("subId, petId, or userId is undefined");
    }
  }

  const handleRestart = () => {
    if (subId && petId && userId) {
      restartPlan(
        {
          subId,
          petId,
          userId,
        },
        {
          onSuccess: (data) => {
            if (data.statusCode === 200) {
              toast.success(data.message);
              const noOfPets = petInfoList?.length;
              if (typeof noOfPets === "number" && noOfPets > 0 && petInfoList) {
                const lastPet = petInfoList[noOfPets - 1];
                if (setselectedPetIndex) setselectedPetIndex(noOfPets - 1);
                if (setSelectedPetIndexFromOrderHistory) setSelectedPetIndexFromOrderHistory(noOfPets - 1);
                if (setSelectedPet) setSelectedPet(lastPet);
                if (setSelectedPetFromOrderHistory) setSelectedPetFromOrderHistory(lastPet);
              }
              window.location.reload();
            }else if(data.statusCode === 402) {
              // toast.success(data.message);
              setRestartPlanPaymentError(data.message || "Payment required for plan restart");
            }
            else{
              toast.error(data.message);
            }
          },
          onError: (error: unknown) => {
            if (error instanceof Error) {
              toast.error(error.message || "Error in restart plan");
            }
          }
        }
      );
    } else {
      toast.error("subId, petId, or userId is undefined");
    }
  }

  const handleReOrder = () => {
    createSubscription(
      {
        user_id: userIdFromAPI,
        account: accountFromAPI,
        shippingDetails: shippingDetailsFromAPI,
        billingDetails: billingDetailsFromAPI,
        // subscriptiondate: subscriptionDateFromAPI,
        subscriptiondate: new Date().toISOString().split("T")[0],
        promoCode: promoCodeFromAPI,
        subscribeToOffers: subscribeToOffersFromAPI,
        // pets: petsFromAPI,
        pets: Array.isArray(petsFromAPI)
          ? petsFromAPI.map((pet: {
              plan: { [key: string]: unknown; planStatus?: string };
              [key: string]: unknown;
            }) => ({
              ...pet,
              plan: {
                ...pet.plan,
                planStatus: "active",
              },
            }))
          : petsFromAPI,
        payment: paymentFromAPI,
        isDeleted: false,
      },
      {
        onSuccess: (data) => {
          if(data.statusCode === 200) {
            toast.success(data.message);
            const noOfPets = petInfoList?.length;
            if (typeof noOfPets === "number" && noOfPets > 0 && petInfoList) {
              const lastPet = petInfoList[noOfPets - 1];
              if (setselectedPetIndex) setselectedPetIndex(noOfPets - 1);
              if (setSelectedPetIndexFromOrderHistory) setSelectedPetIndexFromOrderHistory(noOfPets - 1);
              if (setSelectedPet) setSelectedPet(lastPet);
              if (setSelectedPetFromOrderHistory) setSelectedPetFromOrderHistory(lastPet);
            }
            window.location.reload();
          }else{
            toast.error(data.message);
          }
        },
        onError: (error: unknown) => {
          if (error instanceof Error) {
            toast.error(error.message || "Error in re order"); 
          }
        }
      }
    )
  }

  const handlePausePlan = (dateRange: { from: string; to: string },weeks: number,reason: string) => {
    if (subId && petId && userId) {
      console.log("Date range new1:", dateRange);
      pausePlan(
        {
          subId,
          petId,
          userId,
          formData: {
            pauseReason: reason || "User requested pause",
            weeks: 0,
            startDate: dateRange.from,
            endDate: dateRange.to,
            // pauseReason: "User requested pause",
            // weeks: 0,
            // startDate: pauseStartDate,
            // endDate: pauseEndDate
          }
        },
        {
          onSuccess: (data) => {
            refetchSubscriptionDetails?.();
            if (data.statusCode === 200) {
              toast.success(data.message);
            }else{
              toast.error(data.message);
            }
          },
          onError: (error: unknown) => {
            if (error instanceof Error) {
              toast.error(error.message || "Error in pause plan");
            } else {
              toast.error("Error in pause plan");
            }
          }
        }
      );
    }
  }

  return (
    <div className="break-inside-avoid rounded-xl border border-[#E4E7D3] bg-[#FDFFF4] p-4 sm:p-6  h-fit relative space-y-6 max-w-[345px]">
      {/* status */}
      <BadgeTitle
        label={statusLabel}
        color={statusColor}
        variant="squared"
        className="absolute -top-[.8px]  left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap"
      />

      {/* pet name & invoice */}
      <div className="text-center mb-7">
        <Typography
          tag="h5"
          text={title}
          className="text-primary-dark font-medium text-lg"
        />
        {hasInvoice && (
          <Button variant={"nullBtn"} className="border mx-auto">
            <a href={invoiceDataFromAPI?.filePath} target="_blank" className="flex items-center">
            {/* <a href="https://conasems-ava-prod.s3.sa-east-1.amazonaws.com/aulas/ava/dummy-1641923583.pdf" target="_blank" className="flex items-center"> */}
              <div className="w-5">
              <Image
                src="/icons/download.svg"
                alt="INVOICE"
                fill
                className="!static w-full object-contain"
              />
            </div>
              invoice
            </a>
          </Button>
        )}
      </div>

      {status === "paused" && pausedDuration && pausedPeriod && (
        <div className=" rounded-lg border border-secondary-1 p-4 px-1 text-center relative ">
          <Typography
            tag="p"
            text={pausedDuration}
            className="absolute -top-[.8px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap subtitle3 font-bold bg-[#FDFFF4] px-1 text-secondary-1"
          />
          <Typography
            tag="p"
            text={formattedPauseStartDate && formattedPauseEndDate ? `${formattedPauseStartDate} to ${formattedPauseEndDate}` : "DD.MM.YYYY to DD.MM.YYYY"}
            // text={pausedPeriod}
            className="text-primary-dark font-bold block"
          />
        </div>
      )}

      {status === "cancel" && cancellationTitle && cancellationDate && (
        <div className="rounded-lg border border-secondary-1 p-4 px-1 text-center relative">
          <Typography
            tag="p"
            text={cancellationTitle}
            className="absolute -top-[.8px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap subtitle3 font-bold bg-[#FDFFF4] px-1 text-secondary-1"
          />
          <Typography
            tag="p"
            // text={cancellationDate}
            text={formattedCancellationDate}
            // text={cancellationDateFromAPI}
            className="text-primary-dark font-bold block"
          />
        </div>
      )}

      {/* meal item details */}
      <div className="flex flex-col items-center rounded-lg border border-secondary-1 p-4 px-3 text-center relative ">
        <Typography
          tag="p"
          text={subtitle}
          className="absolute -top-[.8px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap subtitle3 font-bold bg-[#FDFFF4] px-1 text-secondary-1"
        />
        <div className="flex justify-center items-center gap-1">
          <div className="w-7">
            <Image
              src={proteinImageSrc}
              // src="icons/chicken-vector-icon.svg"
              alt={itemName}
              // alt="Chicken"
              fill
              className="!static w-full object-contain"
            />
          </div>
          <Typography
            tag="h5"
            text={itemName}
            className="text-sm font-semibold capitalize text-primary-dark"
          />
        </div>

        {note && (
          <>
            {
              buttonStatus?.isChangeprotein
              ? (
                  <Typography
                    tag="p"
                    text="Protein has been changed"
                  />
                )
              : (
                <>
                  <Button
                    variant={"linkSecondary"}
                    className="underline mt-2 whitespace-normal"
                    onClick={() => setIsProteinPopupOpen(true)}
                  >
                    Change protein for my next order
                  </Button>
                </>
              )
            }
            
            {/* {noteDetails && (
              <Typography
                tag="p"
                text={noteDetails}
                className="mt-2 subtitle3"
              />
            )} */}
            {processingNote && (
              <Typography
                tag="p"
                text={processingNote}
                className="mt-4 subtitle3 text-[#818181]"
              />
            )}
          </>
        )}
      </div>

      {/* price section */}
      <div className="flex items-end">
        <div className="min-w-min">
          {/* Plan Start Date */}
          <div className="pb-1 border-b border-[#E4E7D3]">
            <Typography
              tag="p"
              text="Plan Start Date"
              className="subtitle3 text-black"
            />
            <Typography
              tag="p"
              text={planStartDate}
              className="bodyBtnText text-primary-dark"
            />
          </div>
          {/* Plan Renewal  Date */}
          <div className="pt-1">
            <Typography
              tag="p"
              text="Plan Renewal Date"
              className="subtitle3 text-black"
            />
            <Typography
              tag="p"
              text={planEndDate}
              className="bodyBtnText text-primary-dark"
            />
          </div>
        </div>
        {/* Order Price */}
        <div className="grow text-right">
          <Typography
            tag="p"
            text="Order Price"
            className="subtitle3 text-black"
          />
          <Typography
            tag="h5"
            text={`${price.toFixed(3)} QAR`}
            className="text-primary-dark"
          />
        </div>
      </div>

      {/*nav button */}
      {status === "active" ? (
        planType === "regular" ? (
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="col-span-2">
              {/* <Button 
                className="w-full"
                size="md"
                onClick={() => setIsDowngradePopupOpen(true)}
              >
                {buttons[0]}
              </Button> */}

              {
                bowlSize === "half"
                ? (
                  <>
                    <Button 
                      className="w-full"
                      size="md"
                      disabled={petsFromAPI[0]?.plan?.isUpgrade}
                      onClick={() => setIsDowngradePopupOpen(true)}
                    >
                      { petsFromAPI[0]?.plan?.isUpgrade ? "Upgraded to Full-Bowl" : "Upgrade to Full-Bowl" }
                    </Button>
                    <Typography
                      tag="p"
                      text={upgradePlanPaymentError}
                      className="text-[#f15353] text-center"
                    />
                  </>
                )
                : (
                  <>
                    <Button 
                      className="w-full"
                      size="md"
                      disabled={petsFromAPI[0]?.plan?.isDowngrade}
                      onClick={() => setIsDowngradePopupOpen(true)}
                    >
                      { petsFromAPI[0]?.plan?.isDowngrade ? "Downgraded to Half-Bowl" : "Downgrade to Half-Bowl" }
                    </Button>
                  </>
                )
              }
              
            </div>
            <div className="col-span-1">
              <Button 
                className="w-full" 
                size="md"
                onClick={() => setIsPausePopupOpen(true)}
              >
                {buttons[1]} {/* Pause Plan */}
              </Button>
            </div>
            <div className="col-span-1">
              <Button 
                className="w-full" 
                size="md"
                onClick={() => setIsCancelSubPopupOpen(true)}
              >
                {buttons[2]} {/* Cancel */}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 mt-4">
            {buttons.map((btn, i) => (
              <Button 
                key={i} 
                className="w-full" 
                size="md"
              >
                {btn}
              </Button>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col gap-2 mt-4">
          {buttons.map((btn, i) => (
            <>
              <Button 
                key={i} 
                className="w-full"
                // className={`w-full ${btn === "Reorder" ? "hidden" : ""}`} 
                size="md"
                onClick={() => {
                  if (btn === "Restart Plan") {
                    handleRestart();
                  } else if (btn === "Reorder") {
                    handleReOrder();
                  }
                }}
              >
                {
                  btn === "Restart Plan"
                    ? "Restart Plan"
                    : btn === "Reorder"
                    ? "Reorder"
                    : btn
                }
              </Button>
              <Typography
                tag="p"
                text={restartPlanPaymentError}
                className="text-[#f15353] text-center"
              />
            </> 
          ))}
        </div>
      )}

      <ProteinChangePopup
        key={currentProtein}
        isOpen={isProteinPopupOpen}
        onClose={() => setIsProteinPopupOpen(false)}
        currentSelection={currentProtein}
        onSave={(proteinType) => {
          setCurrentProtein(proteinType);
          if (subId && petId && userId) {
            handleChangeProtein(subId, petId, userId, proteinType);
          } else {
            setChangeProteinError("subId, petId, or userId is undefined");
          }
          // API call to update protein
        }}
        changeProteinError={changeProteinError}
        isChangeProteinLoading={isChangeProteinPending}
      />
      
      <DowngradePlanPopup
        isOpen={isDowngradePopupOpen}
        onClose={() => setIsDowngradePopupOpen(false)}
        onConfirm={() => {
          // API call to downgrade plan
          setIsDowngradePopupOpen(false);
        }}
        bowlSize={bowlSize}
        isDowngrade={buttonStatus?.isDowngrade}
        isUpgrade={buttonStatus?.isUpgrade}
        planStartDate={planStartDate}
        planChangeError={planChangeError}
        planChangeReason={planChangeReason}
        setPlanChangeReason={setPlanChangeReason}
        handleDowngrade={handleDowngrade}
        handleUpgrade={handleUpgrade}
        isDowngradeLoading={isDowngradeLoading}
      />
      
      <CancelSubscriptionPopup
        isOpen={isCancelPopupOpen}
        onClose={() => setIsCancelPopupOpen(false)}
        onCancel={(reason) => {
          // API call to cancel with reason
          // setCancelReason(reason);
          handleCancel(reason);
        }}
      />

      <PauseDeliveriesPopup
        isOpen={isPausePopupOpen}
        setIsPausePopUpOpen={setIsPausePopupOpen}
        formattedPossiblePauseDate={formattedPossiblePauseDate}
        onClose={() => setIsPausePopupOpen(false)}
        onConfirm={(dateRange: { from: string; to: string }, weeks: number, reason) => {
          handlePausePlan(dateRange, weeks, reason);
          setIsPausePopupOpen(false);
        }}
      />

      { 
        isCancelSubPopupOpen && (
         <CancelSub 
            isOpen={isCancelSubPopupOpen} 
            setIsOpen={setIsCancelSubPopupOpen}
            setIsDowngradePopupOpen={setIsDowngradePopupOpen}
            setIsPausePopupOpen={setIsPausePopupOpen}
            setIsCancelPopupOpen={setIsCancelPopupOpen}
         /> 
        ) 
      }
    </div>
  );
};

export default OrderHistoryCard;
