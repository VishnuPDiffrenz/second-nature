import { InputLabeled } from "@/components/molecules/inputLabeled/InputLabeled";
import Typography from "@/components/atoms/typography/Typography";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { useUserStore } from "@/zustand/store/userDataStore";
import { useCreateAddressHook } from "@/hooks/subscriptionHooks/createAddressHook";
import { useUpdateAddressByIdHook } from "@/hooks/subscriptionHooks/updateAddressByIdHook";
import { toast } from "sonner";

interface EditAddressesProps {
  selectedAddress: string;
  setIsEditing: (isEditing: boolean) => void;
  addressId: string;
  type: string;
  editPrefilledAddress: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    emailId?: string;
    alternativeEmailId?: string;
    contactNo?: string;
    alternativeContactNo?: string;
    address?: string;
    aptSuite?: string;
    municipality?: string;
  };
  createOrUpdateAddress: string;
}

type FormData = {
  firstName: string;
  lastName: string;
  emailId: string;
  alternativeEmailId: string;
  contactNo: string;
  alternativeContactNo: string;
  address: string;
  aptSuite: string;
  municipality: string;
};

type FormErrors = {
  firstName?: string;
  lastName?: string;
  emailId?: string;
  alternativeEmailId?: string;
  contactNo?: string;
  alternativeContactNo?: string;
  address?: string;
  aptSuite?: string;
  municipality?: string;
};

export default function EditAddresses({ selectedAddress, setIsEditing, addressId, type, editPrefilledAddress, createOrUpdateAddress }: EditAddressesProps) {

  const { userDetails } = useUserStore();
  const { mutate: createAddress } = useCreateAddressHook();
  const { mutate: updateAddressById } = useUpdateAddressByIdHook();

  const blankFormData = {
    firstName: "",
    lastName: "",
    emailId: "",
    alternativeEmailId: "",
    contactNo: "",
    alternativeContactNo: "",
    address: "",
    aptSuite: "",
    municipality: "",
  }

  const [formData, setFormData] = useState<FormData>({
    firstName: editPrefilledAddress.firstName || "",
    lastName: editPrefilledAddress.lastName || "",
    emailId: editPrefilledAddress.emailId || "",
    alternativeEmailId: editPrefilledAddress.alternativeEmailId || "",
    contactNo: editPrefilledAddress.contactNo || "",
    alternativeContactNo: editPrefilledAddress.alternativeContactNo || "",
    address: editPrefilledAddress.address || "",
    aptSuite: editPrefilledAddress.aptSuite || "",
    municipality: editPrefilledAddress.municipality || "",
  });
  const [ shippingFormData, setShippingFormData ] = useState<FormData>(blankFormData);
  const [ billingFormData, setBillingFormData ] = useState<FormData>(blankFormData);
  const [ createAddressError, setCreateAddressError ] = useState("");
  const [ updateAddressError, setUpdateAddressError ] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if(createOrUpdateAddress === "create") {
      if(type === "shippingAddress") {
        setShippingFormData(formData);
        setBillingFormData(blankFormData);
      } else if(type === "billingAddress") {
        setShippingFormData(blankFormData);
        setBillingFormData(formData);
      }
    } else if(createOrUpdateAddress === "update") {
      if(type === "shippingAddress") {
        setShippingFormData(formData);
        setBillingFormData(blankFormData);
      } else if(type === "billingAddress") {
        setShippingFormData(blankFormData);
        setBillingFormData(formData);
      }
    }
  },[formData])

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    const trimmedValue = value.trim();
    
    switch (name) {
      case 'firstName':
        if (!trimmedValue) return 'First name is required';
        if (trimmedValue.length < 2) return 'First name must be at least 2 characters';
        return;
      case 'lastName':
        if (!trimmedValue) return 'Last name is required';
        if (trimmedValue.length < 1) return 'Last name must be at least 1 character';
        return;
      case 'emailId':
        if (!trimmedValue) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return 'Please enter a valid email';
        return;
      case 'alternativeEmailId':
        if (trimmedValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) 
          return 'Please enter a valid email';
        return;
      case 'contactNo':
        if (!trimmedValue) return 'Mobile number is required';
        if (!/^\+?\d{8,15}$/.test(trimmedValue.replace(/-/g, ''))) 
          return 'Please enter a valid mobile number (8-15 digits)';
        return;
      case 'alternativeContactNo':
        if (trimmedValue && !/^\+?\d{8,15}$/.test(trimmedValue.replace(/-/g, ''))) 
          return 'Please enter a valid mobile number';
        return;
      case 'address':
        if (!trimmedValue) return 'Address is required';
        if (trimmedValue.length < 5) return 'Address must be at least 5 characters';
        return;
      case 'aptSuite':
        if (!trimmedValue) return 'Apartment/Suite is required';
        if (trimmedValue.length < 2) return 'Apartment/Suite must be at least 2 characters';
        return;
      case 'municipality':
        if (!trimmedValue) return 'Municipality is required';
        if (trimmedValue.length < 2) return 'Municipality must be at least 2 characters';
        return;
      default:
        return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone numbers to allow formatting
    if (name === 'contactNo' || name === 'alternativeContactNo') {
      // Allow only numbers, +, and -
      const formattedValue = value.replace(/[^\d+-]/g, '');
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);

      if(createOrUpdateAddress === "create") {
        createAddress({
          user_id: userDetails.userId,
          shippingAddress: [shippingFormData],
          billingAddress: [billingFormData],
        }, {
          onSuccess: (response) => {
            setIsSubmitting(false);
            setCreateAddressError("");
            setIsEditing(false);

            if (response?.statusCode === 200) {
              toast.success(response.message || "Address created successfully");
            } else {
              toast.error(response.message || "Failed to create address.Try again.");
            }
          },
          onError: () => {
            setIsSubmitting(false);
            setCreateAddressError("Error creating address");
            toast.error("Error creating address");
          },
        }); 
      } else if(createOrUpdateAddress === "update") {
        updateAddressById(
        {
          addressId: addressId,
          subId: editPrefilledAddress._id ?? "",
          type: type,
          formData: {
            shippingAddress: shippingFormData,
            billingAddress: billingFormData}
        },
        {
          onSuccess: (response) => {
            setIsSubmitting(false);
            setUpdateAddressError("");
            setIsEditing(false);

            if (response?.statusCode === 200) {
              toast.success(response.message || "Address updated successfully");
            } else {
              toast.error(response.message || "Failed to update address. Try again.");
            }
          },
          onError: () => {
            setIsSubmitting(false);
            setUpdateAddressError("Error updating shipping address by ID");
            toast.error("Error updating shipping address by ID");
          }
        }
      )
      }

    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        tag="h6"
        text={selectedAddress === "shippingAddress" ? "Shipping Address" : "Billing Address"}
        className="capitalize !font-normal mb-6 text-black"
      />
      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-(--space-22-43)">
        {/* First Name */}
        <InputLabeled
          name="firstName"
          label="First Name"
          type="text"
          placeholder="Faheed"
          value={formData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.firstName}
        />
        
        {/* Last Name */}
        <InputLabeled 
          name="lastName"
          label="Last Name" 
          type="text" 
          placeholder="Ahmed"
          value={formData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.lastName}
        />
        
        {/* Email */}
        <InputLabeled
          name="emailId"
          label="Email"
          type="email"
          placeholder="faheed.admin@instavista.qa"
          value={formData.emailId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.emailId}
        />
        
        {/* Alternative Email */}
        <InputLabeled
          name="alternativeEmailId"
          label="Alternative Email"
          type="email"
          placeholder="Type your alternative email"
          value={formData.alternativeEmailId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.alternativeEmailId}
        />
        
        {/* Mobile Number*/}
        <InputLabeled
          name="contactNo"
          label="Mobile Number"
          type="text"
          placeholder="+974-665-556-09"
          value={formData.contactNo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.contactNo}
        />
        
        {/* Alternative Phone Number*/}
        <InputLabeled
          name="alternativeContactNo"
          label="Alternative Phone Number"
          type="text"
          placeholder="Type your alternative phone number"
          value={formData.alternativeContactNo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.alternativeContactNo}
        />
        
        {/* Address line*/}
        <InputLabeled
          name="address"
          label="Address line"
          type="text"
          placeholder="Museum Park St, Old Salata, Corniche, Doha"
          className="sm:col-span-2"
          value={formData.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
        />
        
        {/* Apt/Suite */}
        <InputLabeled
          name="aptSuite"
          label="App/Suite"
          type="text"
          placeholder="Type your App/Suite"
          className="sm:col-span-2"
          value={formData.aptSuite}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.aptSuite}
        />

        {/* Municipality */}
        <InputLabeled
          name="municipality"
          label="Municipality"
          type="text"
          placeholder="Type your Municipality"
          className="sm:col-span-2"
          value={formData.municipality}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.municipality}
        />
        
        <div className="flex gap-3 sm:col-span-2">
          <Button
            type="submit"
            variant={"whiteBtnSecondary2BorderAndText"}
            className="w-fit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : createOrUpdateAddress === "create" ? "Add your address" : "Update your address"}
          </Button>
          <Button
            type="button"
            variant="outlineSecondaryBtn"
            className="w-fit"
            onClick={() => setIsEditing(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </div>
      <Typography
        tag="p"
        text={updateAddressError}
        className="capitalize !font-normal mb-6 text-red-600"
      />
      <Typography
        tag="p"
        text={createAddressError}
        className="capitalize !font-normal mb-6 text-red-600"
      />
    </form>
  );
}