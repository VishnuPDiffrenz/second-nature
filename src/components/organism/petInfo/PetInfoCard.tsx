import Typography from "@/components/atoms/typography/Typography";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React,{ useState, useEffect } from "react";

type PetDetails = {
  name?: string;
  gender?: string;
  ageYear?: number | string;
  dateOfBirth?: string | null;
  currentWeight?: string | number;
  type?: string;
};

type PetInfoCardProps = {
  petDetails: PetDetails;
  setIsEditPetInfo: (value: boolean) => void;
  setPetData: (value: PetDetails) => void;
};

export default function PetInfoCard({ petDetails, setIsEditPetInfo, setPetData }: PetInfoCardProps) {

  const [ ageHeading, setAgeHeading ] = useState("");
  const [ ageContent, setAgeContent ] = useState("");

  useEffect(() => {
    if(petDetails?.ageYear !== 0 && petDetails?.ageYear !== 0 && petDetails?.ageYear !== ""){
      setAgeHeading("Age");
      setAgeContent(`${petDetails?.ageYear} Years Old`);
    } else if(petDetails?.dateOfBirth !== "" && petDetails?.dateOfBirth !== null && petDetails?.dateOfBirth !== undefined){
      setAgeHeading("Date Of Birth");
      setAgeContent(`${petDetails?.dateOfBirth}`);
    }
  },[petDetails]);

  const handleEdit = () => {
    setIsEditPetInfo(true);
    setPetData(petDetails);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col bg-[#FDFFF4] w-[300px] rounded-lg h-auto">
      {/* card header */}
      <div className="flex justify-between border-b p-5 border-[#E4E7D3]">
        <div className="flex items-center gap-2">
          <div className="">
            {
              petDetails?.type === "dog" ? (
                <Image
                  src="/icons/dog-icon.svg"
                  alt="dog"
                  fill
                  className="!static w-full !h-full object-cover"
                />   
              ) : (
                <Image
                  src="/icons/cat-icon.svg"
                  alt="dog"
                  fill
                  className="!static w-full !h-full object-cover"
                />              
              )
            }
          </div>
          <Typography 
            tag="h5" 
            // text="Jacky"
            text={petDetails?.name ?? ""}
          />
        </div>
          <Typography
            tag="h6"
            // text="Girl"
            text={petDetails?.gender ?? ""}
            className="text-primary capitalize bg-[#F3F5E8] rounded-lg py-1.5 px-2.5"
          />
      </div>
      {/* cardbody */}
      <div className="flex justify-between border-b p-7 border-[#E4E7D3]">
        <div className="flex flex-col gap-0.5">
          <Typography 
            tag="h5" 
            text={ageHeading}
            // text="7 Years Old"
            className="!font-medium" 
          />
          <Typography 
            tag="h6" 
            text={ageContent}
            // text="03-10-2018"
            className="!font-medium" 
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <Typography 
            tag="h5" 
            text="Weight" 
            className="!font-medium" 
          />
          <Typography 
            tag="h6" 
            // text="4 kg"
            text={petDetails?.currentWeight !== undefined && petDetails?.currentWeight !== null ? `${Number(petDetails.currentWeight).toFixed(1)} Kg` : ""}
            className="!font-medium" 
          />
        </div>
      </div>
      {/* card footer */}
      <div className="flex justify-center items-center py-3 gap-1">
        <Button 
          variant={"nullBtn"} 
          className="text-secondary-1"
          onClick={() => handleEdit()}
        >
          <div className="w-(--size-14-22) gap-2.5">
            <Image
              src="/icons/edit.svg"
              alt="Edit"
              fill
              className="!static w-full object-contain"
            />
          </div>
          Edit
        </Button>
      </div>
    </div>
  );
}
                                                                          