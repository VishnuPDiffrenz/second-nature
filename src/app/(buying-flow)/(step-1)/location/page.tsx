"use client";

import Typography from "@/components/atoms/typography/Typography";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import PetLocationForm from "@/components/organisms/petLocationForm";
import { usePetStore } from "@/zustand/store/petDataStore";
import { useState, useEffect, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startTransition } from "react";
import { motion } from 'framer-motion';
import { useSearchParams } from "next/navigation";
import WelcomeBackPopUp from "@/components/organism/popUp/WelcomeBackPopUp";
import { useVerifyOtp } from "@/hooks/userHooks/verifyOtpHook";
import { toast } from "sonner";
import useAuthStore from "@/zustand/store/authDataStore";

function LocationContent() {
  const router = useRouter();
  const { setIsEmailVerified } = useAuthStore();
  const searchParams = useSearchParams();
  const mailVerified = searchParams.get("mailVerified");
  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const { mutate: verifyOtp } = useVerifyOtp();

  const { location, setLocation } = usePetStore();
  const [error, setError] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const softEase = [0.33, 1, 0.68, 1] as [number, number, number, number];

  const qatarMunicipalities = [
    "Al Shamal",
    "Al Khor",
    "Al Shahaniya",
    "Umm Salal",
    "Al Daayen",
    "Ad Dawhah(Doha)",
    "Al Rayyan",
    "Al Wakrah",
  ]

  const handleVerifyOTP = () => {
    verifyOtp(
      { 
        formData: { 
          email: email || "", 
          contactNo: "",
          otp: code || "", 
          isWhatsapp: true, 
          isSubscribe: true, 
        }
      },
    {
      onSuccess: (data) => {
        if(data.statusCode === 200) {
          setIsEmailVerified(true);
          startTransition(() => {
            router.push("/location");
          })
        } else {
          setIsEmailVerified(false);
          startTransition(() => {
            router.push("/")
          })
          toast.error(data.message || "Email verification failed");
        }
        // toast.success("OTP verified successfully");
      },
      onError: (error) => {
        setIsEmailVerified(false);
        startTransition(() => {
          router.push("/")
        })
        toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Email verification faileddd");
      }
    });
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the location field
    // if (!location.trim()) {
    //   setError("Please enter your pet's location"); // Show error if empty
    //   return; // Block navigation
    // }

    if (!selectedMunicipality) {
      setError("Please select a location"); // Show error if empty
      return; // Block navigation
    }

    if (selectedMunicipality) {
      setLocation(selectedMunicipality);
      startTransition(() => {
        router.push("/dog-or-cat");
      })
      // router.push("/dog-or-cat");
    }

  };

  useEffect(() => {
    if (selectedMunicipality) {
      setSelectedMunicipality(selectedMunicipality);
      return
    } else if (location) {
      setSelectedMunicipality(location);
      return;
    }
  }, [location, selectedMunicipality]);

  return (
    <BuyingFlowLayout step={1}>
      <form
        action=""
        onSubmit={handleNext}
        className="flex-1 flex flex-col"
      >
        {/* title,content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: softEase }}
          className="h-full flex-1 flex flex-col justify-center items-center ">
          <Typography
            tag="h2"
            text="Your Pet's Location"
            className="text-primary-dark mb-[2.5dvh] text-center"
          />
          {/* <Input
            type="text"
            variant={"roundedEdgeInputLg"}
            className="max-w-[800px] w-[90%] sm:w-[50%] lg:w-[40%] block mx-auto bg-white"
            placeholder="Type your pet's location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setError(""); // Clear error when typing
            }}
          /> */}
          <div
            
            className="max-w-[800px] w-[90%] sm:w-[50%] lg:w-[40%] block mx-auto bg-white ">
            <Select
              value={selectedMunicipality}
              onValueChange={setSelectedMunicipality}
            >
              <SelectTrigger
                variant="roundedEdgeInputLgSecondary"
                className="text-primary-dark font-medium data-[placeholder]:text-[#7C7C7C] shadow-sm"
              >
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent
                className="bg-white border-secondary-1 rounded-2xl text-primary-dark "
              >
                {qatarMunicipalities.map((municipality: string) => (
                  <SelectItem
                    key={municipality}
                    value={municipality}
                    className="px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-white"
                  >
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1 w-[90%] sm:w-[50%] lg:w-[40%]">
              {error}
            </p>
          )}
        </motion.div>


        {/* navigation */}
        <div className="pb-[3dvh] flex flex-col lg:flex-row items-center gap-4 lg:gap-0   landscape:pt-[3dvh] ">
          <div className="max-w-[900px] w-[95%] sm:w-[60%] lg:w-[50%] text-center mb-0.5 p-4 pt-3 border border-[#A1A1A1] rounded-2xl lg:mx-auto ">
            <Typography
              tag="span"
              text="Disclaimer:"
              className="block subtitle3 font-semibold text-[#898989] "
            />
            <Typography
              tag="span"
              text="Please consult your veterinarian if your pet has specific dietary requirements, health issues, or weight targets before subscribing."
              className="block subtitle3 text-[#9B9B9B] w-[75%] text-center mx-auto"
            />
          </div>
          <Button

            type="submit"
            className="gap-2.5  lg:absolute lg:right-[-55px] bottom-4 hover:scale-105 transition-transform duration-300 ease-in-out"
            disabled={!selectedMunicipality}
          // onClick={(e) => {
          //   e.preventDefault();
          //   router.push("/dog-or-cat");
          // }}
          >
            Next
            <div className="w-5">
              <Image
                src="/icons/arrow-next-long.svg"
                alt="icon"
                fill
                className="!static w-full object-contain"
              />
            </div>
          </Button>
        </div>
      </form>

      {
        mailVerified && <WelcomeBackPopUp handleVerifyOTP={handleVerifyOTP} />
      }

      {/* <PetLocationForm /> */}
    </BuyingFlowLayout>
  );
}

export default function Location() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LocationContent />
    </Suspense>
  );
}
