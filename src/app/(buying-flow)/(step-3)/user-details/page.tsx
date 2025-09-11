"use client";
import Typography from "@/components/atoms/typography/Typography";
import BuyingFlowLayout from "@/components/templates/BuyingFlowLayout";
import { useState } from "react";
// import PetActiveCard from "@/components/molecules/petActiveCard/PetActiveCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { usePetStore } from "@/zustand/store/petDataStore";
import { useUserStore } from "@/zustand/store/userDataStore";
import { startTransition } from "react";
import { useEmailVerification } from "@/hooks/userHooks/emailVerificationHook";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
}

interface FormErrors {
  name: string;
  email: string;
}

export default function Page() {

  const router = useRouter();
  const { mutate: emailVerification } = useEmailVerification();

  // const { pets, selectedPetIndex } = usePetStore();
  // const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null; // Handle null case for selectedPetIndex
  //   const currentPetId = selectedPet ? selectedPet.id : null;
  //   const selectedPetName = selectedPet ? selectedPet.name : null;
  //   const activityLevel = selectedPet ? selectedPet.activityLevel : "";

  //   const [selectedActivity, setSelectedActivity] = useState(activityLevel);

  const { userDetails, setUserDetails } = useUserStore();

  const [formData, setFormData] = useState<FormData>({
    name: userDetails.firstName || "",
    email: userDetails.emailAddress || "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: ""
  });

  // const handleNext = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // if (selectedActivity && currentPetId) {
  //   //   setPetDetails(currentPetId, { activityLevel: selectedActivity })
  //   //   router.push("/add-more-pets");
  //   // }
  //   router.push("/checkout");
  // }

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
              toast.success(data?.message || "Email verification successful");
              startTransition(() => {
                router.push("/location");
              })
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
    <BuyingFlowLayout step={1}>

      <form onSubmit={handleNext} className="flex flex-1 flex-col items-center gap-8 bg-white">
        <Typography
          tag="h3"
          text="Your Premium Pet Meal Journey a Click Away"
          className="text-center text-primary-dark"
        />
        {/* <Input
            type="text"
            variant={"roundedEdgeInputLg"}
            className="max-w-[800px] w-[90%] sm:w-[50%] lg:w-[40%] block mx-auto bg-white"
            placeholder="Type Your Name"
            // value={location}
            onChange={() => {
            //   setLocation(e.target.value);
            //   setError(""); // Clear error when typing
            }}
        /> */}

        <div className="flex flex-col items-center gap-4 lg:gap-6 w-full">
          <div className="max-w-[800px] w-full sm:w-[50%] lg:w-[40%]">
            <Input
              name="name"
              type="text"
              variant="roundedEdgeInputLg"
              className="w-full bg-white"
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
          <div className="max-w-[800px] w-full sm:w-[50%] lg:w-[40%]">
            <Input
              name="email"
              type="email"
              variant="roundedEdgeInputLg"
              className="w-full bg-white"
              placeholder="Type Your Email"
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
        </div>

        {/* <Input
            type="text"
            variant={"roundedEdgeInputLg"}
            className="max-w-[800px] w-[90%] sm:w-[50%] lg:w-[40%] block mx-auto bg-white"
            placeholder="Type Your Mail"
            // value={location}
            onChange={() => {
            //   setLocation(e.target.value);
            //   setError(""); // Clear error when typing
            }}
        /> */}





      </form>
      {/* Navigation */}
      <div className="w-full pb-[3dvh] flex justify-between items-center gap-4 lg:gap-0 lg:items-end pt-[3dvh]">
        <Button
          variant={"outlineSecondaryBtn"}
          className="gap-2.5  lg:ml-[-55px]"
          onClick={(e) => {
            e.preventDefault();
            startTransition(() => {
              router.push("/");
            })
            // router.push("/choose-our-plans");
          }}
        // disabled={isSubmitting}
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
          type="submit"
          className="gap-2.5 lg:ml-auto lg:mr-[-55px]"
          disabled={!(formData.name && formData.email)}
          onClick={handleNext}
        >
          Next
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
    </BuyingFlowLayout>
  );
}
