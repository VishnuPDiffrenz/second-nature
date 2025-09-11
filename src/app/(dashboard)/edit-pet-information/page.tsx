"use client"

import Typography from "@/components/atoms/typography/Typography";
import PetInfoCard from "@/components/organism/petInfo/PetInfoCard";
// import EditPetInfo from "@/components/pages/dashboard/editPetInformation/EditPetInfo";
import EditPetInfo from "@/components/pageSections/dashboard/editPetInformation/EditPetInfo";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/store/userDataStore";
import { useGetPetDetailsByUserId } from "@/hooks/subscriptionHooks/getPetDetailsByUserIdHook";

type PetDetails = {
  name?: string;
  gender?: string;
  ageYear?: number | string;
  dateOfBirth?: string | null;
  currentWeight?: string | number;
};

export default function Page() {

  const { userDetails } = useUserStore();
  const userId = userDetails?.userId;
  const { data: petDetails, refetch: refetchPetDetails } = useGetPetDetailsByUserId(userId);
  const [ isEditPetInfo, setIsEditPetInfo ] = useState(false);
  const [ petData, setPetData ] = useState({});

  useEffect(() => {
    refetchPetDetails();
  }, [isEditPetInfo]);

  return (
    <>
      <Typography
        tag="h5"
        text="Edit Pet Information"
        className="capitalize !font-normal mb-6 text-black"
      />

      {
        isEditPetInfo
        ? <EditPetInfo setIsEditPetInfo={setIsEditPetInfo} petData={petData} />
        : <div>
            {
              petDetails
              ? <div className="flex flex-wrap gap-5 sm:gap-6">
                  {
                    petDetails?.result?.map((pet: PetDetails, index: number) => (
                      <PetInfoCard key={index} setIsEditPetInfo={setIsEditPetInfo} petDetails={pet} setPetData={setPetData} />
                    ))
                  }
                </div>
              : <div>Loading...</div>
            }
          </div>
      }
          
    </>
  );
}
