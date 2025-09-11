"use client";

import Typography from "@/components/atoms/typography/Typography";
import EditAddresses from "@/components/pageSections/dashboard/addresses/EditAddresses";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React,{ useEffect, useState } from "react";
import { useUserStore } from "@/zustand/store/userDataStore";
import { useGetAddressById } from "@/hooks/subscriptionHooks/getAddressByIdHook";

type Address = {
    address: string;
    aptSuite?: string;
    municipality?: string;
    // Add other fields as needed
};

// type AddressType = "shippingAddress" | "billingAddress";

export default function Address() {

  // const { userDetails } = useUserStore();
  const userId = useUserStore((state) => state.userDetails.userId || "");
  const { data: addressData, refetch: refetchAddress } = useGetAddressById(userId || "");
  const addressId = addressData?.result?._id;

  const [ isEditing, setIsEditing ] = useState(false);
  // const [ isShippingAddressEditing, setIsShippingAddressEditing ] = useState(false);
  // const [ isBillingAddressEditing, setIsBillingAddressEditing ] = useState(false);
  const [ selectedAddress, setSelectedAddress ] = useState("shippingAddress");
  const [ editPrefilledAddress, setEditPrefilledAddress ] = useState({});
  const [ createOrUpdateAddress, setCreateOrUpdateAddress ] = useState("");

  const handleEdit = ({ address, type: addressType }: { address: Address; type: string }) => {
    setIsEditing(true);
    setSelectedAddress(addressType);
    setEditPrefilledAddress(address);
    setCreateOrUpdateAddress("update");
  }

  const handleAddNewAddress = ({ type: addressType }: { type: string }) => {
    setIsEditing(true);
    setSelectedAddress(addressType);
    setEditPrefilledAddress({});
    setCreateOrUpdateAddress("create");
  }

  useEffect(() => {
    refetchAddress();
  }, [isEditing])

  return (
    <>
      <Typography
        tag="h5"
        text="addresses"
        className="capitalize !font-normal mb-6 text-black"
      />

      {
        isEditing
        ? <EditAddresses
            selectedAddress={selectedAddress}
            setIsEditing={setIsEditing}
            addressId={addressId}
            type={selectedAddress}
            editPrefilledAddress={editPrefilledAddress}
            createOrUpdateAddress={createOrUpdateAddress}
          />
        : <div className="flex flex-col gap-15">
            {/* Shipping Address  */}
            <div>
              <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                <Typography tag="h6" text="Shipping Address " />
                <Button 
                  variant={'linkTextBlack'} 
                  className="justify-start"
                  onClick={() => handleAddNewAddress({ type: "shippingAddress" })}
                >
                  <div className="w-4">
                    <Image src="/icons/add-icon.svg" alt="Add new shipping address" fill  className="!static w-full object-contain"/>
                  </div>
                  Add new shipping address
                </Button>
              </div>

              {
                addressData?.statusCode === 200
                ? (
                    addressData?.result?.shippingAddress?.map((address: Address, index: number) => (
                      <div key={index} className="bg-[#FDFFF4] border border-[#E4E7D3] rounded-xl mb-6 p-6 flex flex-col items-start sm:flex-row gap-5 lg:gap-[30%] ">
                        <div className="grow ">
                          <Typography
                            tag="span"
                            text="Shipping Address"
                            className="h6 block !font-normal mb-3"
                          />

                          <Typography
                            tag="h5"
                            text={address?.address}
                            // text="Museum Park St, Old Salata, Corniche, Doha "
                            className="capitalize"
                          />
                          <Typography
                            tag="h5"
                            text={address?.aptSuite ?? ""}
                            className="capitalize"
                          />
                          <Typography
                            tag="h5"
                            text={address?.municipality ?? ""}
                            className="capitalize"
                          />
                        </div>
                        <Button 
                          variant={"nullBtn"} 
                          className="text-secondary-1"
                          onClick={() => handleEdit({ address: address, type: "shippingAddress" })}
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
                    ))
                  )
                : <Typography
                    tag="p"
                    text="No shipping address found"
                    className="capitalize text-red-500"
                  />
              }

              
            </div>
            {/* Billing Address  */}
            <div>
              <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-4  sm:justify-between">
                <Typography tag="h6" text="Billing Address  "  />
                <Button 
                  variant={'linkTextBlack'} 
                  className="justify-start"
                  onClick={() => handleAddNewAddress({ type: "billingAddress" })}
                >
                  <div className="w-4">
                    <Image src="/icons/add-icon.svg" alt="Add new shipping address" fill  className="!static w-full object-contain"/>
                  </div>
                  Add new billing address
                </Button>
              </div>

              {
                addressData?.statusCode === 200
                ? (
                    addressData?.result?.billingAddress?.map((address: Address, index: number) => (
                      <div key={index} className="bg-[#FDFFF4] border border-[#E4E7D3] rounded-xl mb-6 p-6 flex flex-col items-start sm:flex-row gap-5 lg:gap-[30%] ">
                        <div className="grow ">
                          <Typography
                            tag="span"
                            text="Billing Address"
                            className="h6 block !font-normal mb-3"
                          />

                          <Typography
                            tag="h5"
                            text={address?.address}
                            // text="Museum Park St, Old Salata, Corniche, Doha "
                            className="capitalize"
                          />
                          <Typography
                            tag="h5"
                            text={address?.aptSuite ?? ""}
                            className="capitalize"
                          />
                          <Typography
                            tag="h5"
                            text={address?.municipality ?? ""}
                            className="capitalize"
                          />
                        </div>
                        <Button 
                          variant={"nullBtn"} 
                          className="text-secondary-1"
                          onClick={() => handleEdit({address: address, type: "billingAddress"})}
                        >
                          <div className="w-(--size-14-22) gap-2.5">
                            <Image
                              src="/icons/edit.svg"
                              alt="Edit "
                              fill
                              className="!static w-full object-contain"
                            />
                          </div>
                          Edit
                        </Button>
                      </div>
                    ))
                  )
                : <Typography
                    tag="p"
                    text="No billing address found"
                    className="capitalize text-red-500"
                  />
              }

            </div>
          </div>
      }

      {/*if Edit Addresses */}
      {/* <EditAddresses/> */}

    </>
  );
}
