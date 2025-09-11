import React from "react";
import Typography from "@/components/atoms/typography/Typography";
// import PetSelectCard from "@/components/molecules/petSelectCard/PetSelectCard";
import PetProteinCard from "@/components/molecules/petProteinCard/PetProteinCard";
import PetBowlSizeCard from "@/components/molecules/petBowlSizeCard/PetBowlSizeCard";
import { cn } from "@/lib/utils";
import OfferBadge from "@/components/atoms/offerBadge/OfferBadge";
import { useGetAllProtein } from "@/hooks/subscriptionHooks/getAllProteinHook";
import { useGetAllBowl } from "@/hooks/subscriptionHooks/getAllBowlHook";

interface PlanCardProps {
  bgColour: "bg-white" | "bg-[#FDFFF0]";
  offerBadge?: string;
  heading: string;
  description: string;
  price: number;
  setPrice?: (price: number) => void;
  isSelected?: boolean;
  protein?: string;
  setProtein?: (protein: string) => void;
  bowlSize?: string;
  setBowlSize?: (bowlSize: string) => void;
  isPriceLoading?: boolean;
  onClick?: () => void;
}
export default function PlanCard({
  bgColour,
  offerBadge,
  heading,
  description,
  price,
  isSelected = false,
  protein,
  setProtein,
  bowlSize,
  setBowlSize,
  isPriceLoading = false,
  onClick,
}: PlanCardProps) {
  const {
    data: proteinData,
  }: { data?: { result: { _id: string; protein_name: string }[] } } =
    useGetAllProtein();
  const { data: bowlData } = useGetAllBowl();

  return (
    <div
      className={cn(
        `flex flex-col relative border rounded-2xl w-full sm:w-ful lg:w-[40%] px-5 py-10 lg:p-14`,
        bgColour,
        isSelected ? "border-primary-dark shadow-md" : "border-slate-300"
      )}
      onClick={onClick}
    >
      {offerBadge && <OfferBadge content={offerBadge} />}
      <div className="w-full border-b border-primary pb-[var(--space-30-40)] flex flex-col">
        <Typography
          tag="h3"
          text={heading}
          className="text-center text-primary-dark mb-2 highlight"
        />
        <Typography
          tag="sub"
          text={description}
          className="text-center font-bold text-[#000000] mb-4"
        />
        {isPriceLoading ? (
          <Typography
            tag="h5"
            text="Loading..."
            className="text-center text-transparent"
            // className="text-center text-secondary-1"
          />
        ) : (
          <>
            <Typography
              tag="h5"
              text="QAR "
              className="text-center text-secondary-1"
            >
              <Typography tag="span" text={price?.toString()} className="" />
            </Typography>
          </>
        )}
      </div>
      <div className="flex flex-col pt-[var(--space-30-40)]">
        <Typography
          tag="h6"
          text="Step 1:"
          className="text-center  pb-[var(--space-10-20)]"
        >
          <Typography
            tag="span"
            text=" Choose Protein"
            className="text-secondary-1"
          />
        </Typography>
        <div className="flex justify-center gap-[var(--space-10-20)]">
          {proteinData?.result?.map(
            (proteinDetails: { _id: string; protein_name: string }) => (
              <PetProteinCard
                key={proteinDetails._id}
                imageSrc={
                  proteinDetails.protein_name === "chicken"
                    ? "/icons/card-chicken.svg"
                    : proteinDetails.protein_name === "beef"
                    ? "/icons/card-beef.svg"
                    : "/icons/card-lamb.svg"
                }
                label={proteinDetails.protein_name}
                altText={proteinDetails.protein_name}
                selectedProtein={protein === proteinDetails.protein_name}
                setSelectedProtein={() => {
                  if (protein !== proteinDetails.protein_name) {
                    if (setProtein) setProtein(proteinDetails.protein_name);
                    if (setBowlSize) setBowlSize("full");
                  }
                }}
              />
            )
          )}

          {/* <PetProteinCard
            imageSrc="/icons/card-chicken.svg"
            label="Chicken"
            altText="Chicken"
            selectedProtein={ protein === "chicken"}
            setSelectedProtein={ () => setProtein && setProtein("chicken")}
          /> */}
        </div>
      </div>
      <div className="flex flex-col pt-[var(--space-30-40)]">
        <Typography
          tag="h6"
          text="Step 2:"
          className="text-center pb-[var(--space-10-20)]"
        >
          <Typography
            tag="span"
            text=" Choose Size"
            className="text-secondary-1"
          />
        </Typography>
        <div className="flex justify-center gap-[var(--space-10-20)]">
          {bowlData?.result?.map(
            (bowlDetails: { _id: string; bowl_type: string }) => (
              <PetBowlSizeCard
                key={bowlDetails._id}
                imageSrc={
                  bowlDetails.bowl_type === "full"
                    ? "/icons/full-bowl.svg"
                    : "/icons/half-bowl.svg"
                }
                label={`${bowlDetails.bowl_type} bowl`}
                altText={bowlDetails.bowl_type}
                selectedBowlSize={bowlSize === bowlDetails.bowl_type}
                setSelectedBowlSize={() =>
                  setBowlSize && setBowlSize(bowlDetails.bowl_type)
                }
              />
            )
          )}

          {/* <PetBowlSizeCard
            imageSrc="/icons/full-bowl.svg"
            label="full-bowl"
            altText="full-bowl"
            selectedBowlSize={ bowlSize === "full"}
            setSelectedBowlSize={ () => setBowlSize && setBowlSize("full")}
          /> */}
        </div>
      </div>
      {/* <div 
        onClick={() => window.open("/terms-and-conditions", "_blank")} 
        className="mx-auto"
      >
        <Typography
          tag="p"
          text="Terms and conditions >"
          className="text-center cursor-pointer font-bold text-secondary-1 mt-[var(--space-30-40)]"
        />
      </div> */}
    </div>
  );
}
