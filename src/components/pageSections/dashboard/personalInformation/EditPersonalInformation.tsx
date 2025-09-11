import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputLabeled } from "@/components/molecules/inputLabeled/InputLabeled";
import { Button } from "@/components/ui/button";
import { useUpdateUserHook } from "@/hooks/userHooks/getUserDetailsHook";
import { useGetUserDetails} from "@/hooks/userHooks/getUserDetailsHook";
import { useUserStore} from "@/zustand/store/userDataStore";
import { toast } from "sonner";

const userSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name too long"),
  lastName: z.string()
    .min(1, "Last name must be at least 1 character")
    .max(50, "Last name too long"),
  email: z.string()
    .email("Invalid email address"),
  altEmail: z.string()
    .email("Invalid email")
    .or(z.literal(""))
    .optional(),
  mobile: z.string()
    .min(10, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Invalid phone number format"),
  altMobile: z.string()
    .min(10, "Phone number too short")
    .max(15, "Phone number too long")
    .regex(/^\d+$/, "Invalid phone number format")
    .or(z.literal(""))
    .optional()
});

type UserFormData = z.infer<typeof userSchema>;

interface EditPersonalInformationProps {
  userId: string;
  setIsEditing: (isEditing: boolean) => void;
  defaultValues?: UserFormData;
}

export default function EditPersonalInformation({ 
  userId,
  setIsEditing,
  defaultValues 
}: EditPersonalInformationProps) {

  const { userDetails } = useUserStore();
  const { data: getUserDetails } = useGetUserDetails(userDetails.userId);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting, touchedFields },
    trigger,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    mode: "onTouched", // Validate on blur after first touch
    reValidateMode: "onChange", // Re-validate on change after first blur
    defaultValues: defaultValues || {
      firstName: getUserDetails?.result?.firstname || "",
      lastName: getUserDetails?.result?.lastname || "",
      email: getUserDetails?.result?.emailId || "",
      altEmail: getUserDetails?.result?.alternativeEmail || "",
      mobile: getUserDetails?.result?.contactNo || "",
      altMobile: getUserDetails?.result?.alternativeMobile || "",
    }
  });

  // Custom error display logic
  const shouldShowError = (fieldName: keyof UserFormData) => {
    // Show error if:
    // 1. The field has been touched/blurred, AND
    // 2. There's currently a validation error
    return touchedFields[fieldName] && errors[fieldName];
  };

  // Custom onBlur handler that triggers validation
  const handleBlur = async (fieldName: keyof UserFormData) => {
    await trigger(fieldName); // Validate just this field
  };

  const { mutate } = useUpdateUserHook();

  const onSubmit = (data: UserFormData) => {
    mutate(
      {
        userId,
        firstname: data.firstName,
        lastname: data.lastName,
        emailId: data.email,
        alternativeEmail: data.altEmail || "",
        contactNo: data.mobile,
        alternativeMobile: data.altMobile || "",
      },
      {
        onSuccess: (response) => {

          if (response?.statusCode === 200) {
            toast.success(response.message || "User updated successfully");
          } else {
            toast.error(response.message || "Failed to update user. Try again.");
          }

          setIsEditing(false);
          window.location.reload();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update user. Try again.");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-(--space-22-43)">
        {/* First Name */}
        <InputLabeled
          label="First Name*"
          type="text"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter First Name"
          error={shouldShowError('firstName') ? errors.firstName?.message : undefined}
          {...register("firstName", {
            onBlur: () => handleBlur('firstName')
          })}
        />

        {/* Last Name */}
        <InputLabeled
          label="Last Name*"
          type="text"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter Last Name"
          error={shouldShowError('lastName') ? errors.lastName?.message : undefined}
          {...register("lastName", {
            onBlur: () => handleBlur('lastName')
          })}
        />

        {/* Email */}
        <InputLabeled
          label="Email*"
          type="email"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter Email Address"
          error={shouldShowError('email') ? errors.email?.message : undefined}
          {...register("email", {
            onBlur: () => handleBlur('email')
          })}
        />

        {/* Alternative Email */}
        <InputLabeled
          label="Alternative Email"
          type="email"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter Alternative Email"
          error={shouldShowError('altEmail') ? errors.altEmail?.message : undefined}
          {...register("altEmail", {
            onBlur: () => handleBlur('altEmail')
          })}
        />

        {/* Mobile Number */}
        <InputLabeled
          label="Mobile Number*"
          type="tel"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter Phone Number"
          error={shouldShowError('mobile') ? errors.mobile?.message : undefined}
          {...register("mobile", {
            onBlur: () => handleBlur('mobile')
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/\D/g, ""); // Remove non-digits
          }}
        />

        {/* Alternative Phone */}
        <InputLabeled
          label="Alternative Phone"
          type="tel"
          inputClassName="!text-[16px] lg:!text-[18px]"
          placeholder="Enter Alternative Phone Number"
          error={shouldShowError('altMobile') ? errors.altMobile?.message : undefined}
          {...register("altMobile", {
            onBlur: () => handleBlur('altMobile')
          })}
          onInput={(e) => {
            const input = e.target as HTMLInputElement;
            input.value = input.value.replace(/\D/g, ""); // Remove non-digits
          }}
        />
      </div>

      <div className="flex gap-4 mt-10">
        <Button 
          type="submit" 
          variant="whiteBtnSecondary2BorderAndText"
          disabled={!isValid || isSubmitting}
        >
          Update Information
        </Button>
        
        <Button 
          type="button" 
          variant="outlinePrimaryBtn"
          className="!text-secondary-1"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}