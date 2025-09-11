"use client";

import Typography from '@/components/atoms/typography/Typography'
import Header from '@/components/organism/header/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React, { useState } from 'react'
// import { useRouter } from "next/navigation";
import { useUserStore } from '@/zustand/store/userDataStore';
// import { startTransition } from "react";
import { useEmailVerification } from "@/hooks/userHooks/emailVerificationHook";
import { toast } from "sonner";
import VerificationSentPopUp from '@/components/organism/popUp/VerificationSentPopUp';

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name: string;
  email: string;
}

export default function VerifyEmail() {

  // const router = useRouter();

  const { mutate: emailVerification } = useEmailVerification();
  const { userDetails, setUserDetails } = useUserStore();

  const [ showVerificationSentPopUp, setShowVerificationSentPopUp ] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: userDetails.firstName || "",
    email: userDetails.emailAddress || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    // Only validate the blurred field
    const fieldError = {
      [name]: name === "email"
        ? /^\S+@\S+\.\S+$/.test(formData[name]) ? "" : "Enter a valid email"
        : formData[name as keyof FormData] ? "" : `Name is required`
    };
    setErrors(prev => ({ ...prev, ...fieldError }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: formData.name ? "" : "Name is required",
      email: /^\S+@\S+\.\S+$/.test(formData.email) ? "" : "Enter a valid email"
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // setIsSubmitting(true);
    // Here you would typically send the data to your API
    // For now, we'll just simulate a short delay

    if (formData.name && formData.email) {
      // setUserDetails({
      //   firstName: formData.name,
      //   emailAddress: formData.email
      // });

      emailVerification(
        { formData },
        {
          onSuccess: (data) => {

            setUserDetails({
              firstName: formData.name,
              emailAddress: formData.email
            });

            if(data?.statusCode === 200) {
              setShowVerificationSentPopUp(true);
              // toast.success(data?.message || "Email verification successful");
              // startTransition(() => {
              //   router.push("/location");
              // })
            }else{
              toast.error(data?.message || "Email verification failed");
            }
          },
          onError: (error) => {
            toast.error((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Error in email verification");
          }
        }
      );
    }
  };

  return (
    <div className='flex flex-col min-h-[100dvh]'>
      <Header  />
      <div className='flex grow   items-center justify-center portrait:min-h-[400px] portrait:h-[calc(100dvh-127)] landscape:min-h-[395px] landscape:h-[calc(100dvh-144px)] landscape:max-h-[800px]'>
        <div className='max-w-[800px] w-full lg:w-[55%] xl:w-[70%] xl:max-w-[1000px]  mx-auto bg-white  flex flex-col-reverse lg:flex-row justify-start lg:justify-center custom-mt items-center gap-[40px] 2xl:gap-[60px]'>
          <div className='relative flex-1 shrink-0 w-full '>

            <picture>
              <source srcSet="/images/verify-email.webp" media="(min-width: 992px)" />
              <source srcSet="/images/verify-email-mob.webp" media="(max-width: 991.98px)" />
              <img src="/images/verify-email.webp" alt="Description of image" className='w-full h-[36dvh] sm:h-auto sm:max-h-[40dvh] lg:max-h-max object-cover object-top lg:object-center'/>

            </picture>
          </div>
          <div className='flex-1 shrink-0  w-[90%] sm:w-[60%] lg:w-full'>
            <form 
              action=""
              onSubmit={handleNext}
            >
              <Typography
                tag="h2"
                text="Verify your Email"
                className="text-primary-dark mb-[5.5dvh] lg:!text-[32px] text-center lg:text-left !font-bold"
              />
              <div className="mb-[2dvh]">
                <Input
                  type="text"
                  name="name"
                  variant={"roundedEdgeInputLg"}
                  className={`w-full text-start text-primary-dark font-semibold  placeholder-[#7C7C7C] h-12 placeholder:font-medium focus:placeholder-slate-300 !pr-0`}
                  placeholder="Type Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1 pl-2">
                    {errors.name}
                  </p>
                )}
              </div>
              <div className="mb-[3.5dvh] ">
                <Input
                  type="text"
                  name="email"
                  variant={"roundedEdgeInputLg"}
                  className={`w-full text-start text-primary-dark font-semibold  placeholder-[#7C7C7C] h-12 placeholder:font-medium focus:placeholder-slate-300 !pr-0`}
                  placeholder="Type Your Mail"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p id="email-error" className="text-red-500 text-sm mt-1 pl-2">
                    {errors.email}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="hover:scale-105 transition-transform duration-300 ease-in-out mx-auto lg:mx-0" 
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
            </form>

            {showVerificationSentPopUp && <VerificationSentPopUp isOpen={showVerificationSentPopUp} setIsOpen={setShowVerificationSentPopUp} />}

          </div>
        </div>
      </div>
    </div>
  )
}
