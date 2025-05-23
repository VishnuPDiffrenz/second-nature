"use client";

import Typography from '@/components/atoms/typography/Typography'
import AlertBar from '@/components/molecules/alertBar/AlertBar'
import { InputLabeled } from '@/components/molecules/inputLabeled/InputLabeled'
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import BillingDetails from './BillingDetails'
import Payment from './Payment';
import { useUserStore } from '@/zustand/store/userDataStore';
import { usePetStore } from '@/zustand/store/petDataStore';
// import useAuthStore from '@/zustand/store/authDataStore';
import { useCreateAddressHook } from '@/hooks/subscriptionHooks/createAddressHook';
import { useGetAddressById } from '@/hooks/subscriptionHooks/getAddressByIdHook';
import { useCreatePetHook } from '@/hooks/subscriptionHooks/createPetHook';

type FormField = 'firstName' | 'lastName' | 'mobile' | 'address' | 'aptSuite' | 'municipality';

interface ShippingFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  aptSuite: string;
  municipality: string;
}

interface BillingFormData extends ShippingFormData {
  useDifferentBilling: boolean;
}

interface FormErrors {
  firstName: string;
  lastName: string;
  mobile: string;
  address: string;
  aptSuite: string;
  municipality: string;
}

export default function ShippingDetail() {
  const { userDetails, setUserDetails } = useUserStore();
  // const { isAuthenticated } = useAuthStore();
  const { mutate } = useCreateAddressHook();
  const { mutate: createPet } = useCreatePetHook();
  const { data: addressData } = useGetAddressById(userDetails.userId || "");
  const { pets } = usePetStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCheckBox, setSelectedCheckBox] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  
  const [shippingFormData, setShippingFormData] = useState<ShippingFormData>({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    aptSuite: "",
    municipality: ""
  });

  const [billingFormData, setBillingFormData] = useState<BillingFormData>({
    firstName: "",
    lastName: "",
    mobile: "",
    address: "",
    aptSuite: "",
    municipality: "",
    useDifferentBilling: true
  });

  const [shippingErrors, setShippingErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    aptSuite: '',
    municipality: ''
  });

  const [billingErrors, setBillingErrors] = useState<FormErrors>({
    firstName: '',
    lastName: '',
    mobile: '',
    address: '',
    aptSuite: '',
    municipality: ''
  });

  // Initialize form data with proper priority
  useEffect(() => {
    if (addressData || userDetails) {

      const shippingAddressLength = addressData?.result?.shippingAddress?.length;
      const billingAddressLength = addressData?.result?.billingAddress?.length;

      setShippingFormData({
        firstName: addressData?.result?.shippingAddress?.[shippingAddressLength]?.firstName || userDetails?.shippingDetails?.firstName || "",
        lastName: addressData?.result?.shippingAddress?.[shippingAddressLength]?.lastName || userDetails?.shippingDetails?.lastName || "",
        mobile: addressData?.result?.shippingAddress?.[shippingAddressLength]?.contactNo || userDetails?.shippingDetails?.mobile || "",
        address: addressData?.result?.shippingAddress?.[shippingAddressLength]?.address || userDetails?.shippingDetails?.address || "",
        aptSuite: addressData?.result?.shippingAddress?.[shippingAddressLength]?.aptSuite || userDetails?.shippingDetails?.aptSuite || "",
        municipality: addressData?.result?.shippingAddress?.[shippingAddressLength]?.municipality || userDetails?.shippingDetails?.municipality || "",
      });

      setBillingFormData({
        firstName: addressData?.result?.billingAddress?.[billingAddressLength]?.firstName || userDetails?.billingDetails?.firstName || "",
        lastName: addressData?.result?.billingAddress?.[billingAddressLength]?.lastName || userDetails?.billingDetails?.lastName || "",
        mobile: addressData?.result?.billingAddress?.[billingAddressLength]?.contactNo || userDetails?.billingDetails?.mobile || "",
        address: addressData?.result?.billingAddress?.[billingAddressLength]?.address || userDetails?.billingDetails?.address || "",
        aptSuite: addressData?.result?.billingAddress?.[billingAddressLength]?.aptSuite || userDetails?.billingDetails?.aptSuite || "",
        municipality: addressData?.result?.billingAddress?.[billingAddressLength]?.municipality || userDetails?.billingDetails?.municipality || "",
        useDifferentBilling: userDetails?.billingDetails?.useDifferentBilling ?? true,
      });

      // Set checkbox state based on fetched data
      if (addressData?.result?.billingAddress?.[billingAddressLength] || userDetails?.billingDetails) {
        console.log("Shipping address data", addressData?.result?.shippingAddress);
        console.log("Billing address data", addressData?.result?.billingAddress);
        setSelectedCheckBox(
          userDetails?.billingDetails?.useDifferentBilling ??
          addressData?.result?.billingAddress?.[billingAddressLength]?.useDifferentBilling ??
          true
        );
      }
    }
    setIsLoading(false);
  }, [addressData, userDetails]);

  // Sync billing data when checkbox is unchecked
  useEffect(() => {
    if (!selectedCheckBox) {
      setBillingFormData(() => ({ 
        ...shippingFormData, 
        useDifferentBilling: true 
      }));
    }
  }, [selectedCheckBox, shippingFormData]);

  const validateField = useCallback((name: FormField, value: string): string => {
    const trimmedValue = value.trim();
    switch (name) {
      case 'firstName':
        if (!trimmedValue) return 'First name is required';
        if (trimmedValue.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!trimmedValue) return 'Last name is required';
        if (trimmedValue.length < 1) return 'Last name must be at least 1 character';
        return '';
      case 'mobile':
        if (!trimmedValue) return 'Mobile number is required';
        if (!/^[0-9]{10,15}$/.test(trimmedValue)) return 'Please enter a valid mobile number (10-15 digits)';
        return '';
      case 'address':
        if (!trimmedValue) return 'Address is required';
        if (trimmedValue.length < 5) return 'Address must be at least 5 characters';
        return '';
      case 'aptSuite':
        if (!trimmedValue) return 'Apartment or Suite is required';
        if (trimmedValue.length < 2) return 'Apartment/Suite must be at least 2 characters';
        return '';
      case 'municipality':
        if (!trimmedValue) return 'Municipality is required';
        return '';
      default:
        return '';
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "mobile") {
    // Allow only numbers and limit to 15 characters
      const numbersOnly = value.replace(/\D/g, '').slice(0, 15);
      setShippingFormData(prev => ({ ...prev, [name]: numbersOnly }));
      return;    
    }

    setShippingFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setShippingErrors(prev => ({ ...prev, [name]: validateField(name as FormField, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setShippingErrors(prev => ({ ...prev, [name]: validateField(name as FormField, value) }));
  };

  const validateShippingForm = (): boolean => {
    const newErrors: FormErrors = {} as FormErrors;
    let isValid = true;

    (Object.keys(shippingFormData) as FormField[]).forEach(key => {
      const error = validateField(key, shippingFormData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setShippingErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      mobile: true,
      address: true,
      aptSuite: true,
      municipality: true
    });

    return isValid;
  };

  const validateBillingForm = (): boolean => {
    const newErrors: FormErrors = {} as FormErrors;
    let isValid = true;

    (Object.keys(billingFormData) as (keyof BillingFormData)[]).forEach(key => {
      if (key !== 'useDifferentBilling') {
        const error = validateField(key as FormField, billingFormData[key] as string);
        if (error) {
          newErrors[key as FormField] = error;
          isValid = false;
        }
      }
    });

    setBillingErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      mobile: true,
      address: true,
      aptSuite: true,
      municipality: true
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const shippingValid = validateShippingForm();
    const billingValid = validateBillingForm();

    if (shippingValid && billingValid) {
      setIsSubmittingAddress(true);

      const updatedUserDetails = {
        ...userDetails,
        shippingDetails: shippingFormData,
        billingDetails: billingFormData,
      };

      setUserDetails(updatedUserDetails);

      mutate({
        user_id: userDetails.userId,
        shippingAddress: [{
          firstName: shippingFormData.firstName,
          lastName: shippingFormData.lastName,
          contactNo: shippingFormData.mobile,
          address: shippingFormData.address,
          aptSuite: shippingFormData.aptSuite,
          municipality: shippingFormData.municipality,
        }],
        billingAddress: [{
          firstName: billingFormData.firstName,
          lastName: billingFormData.lastName,
          contactNo: billingFormData.mobile,
          address: billingFormData.address,
          aptSuite: billingFormData.aptSuite,
          municipality: billingFormData.municipality,
          useDifferentBilling: billingFormData.useDifferentBilling,
        }],
      }, {
        onSuccess: () => {
          setShowPaymentDetails(true);
          setIsSubmittingAddress(false);
        },
        onError: (error) => {
          console.error('Error updating address:', error);
          setIsSubmittingAddress(false);
        },
      });
    }

    pets.map((pet) => {
      createPet({
        user_id: userDetails.userId,
        name: pet.name || "",
        type: pet.catOrDog || "",
        gender: pet.gender || "",
        location: pet.location || "",
        dateOfBirth: "",
        ageMonth: pet.ageMonth || 0,
        ageYear: pet.ageYear || 0,
        breed: pet.breed || "",
        crossBreeds: [ pet.crossBreed || "" ],
        activityLevel: pet.activityLevel || "",
        currentWeight: pet.currentWeight || 0,
        targetWeight: pet.targetWeight || 0,
        plan: {
            type: pet.planType || "",
            duration: pet.planType === "regular" ? "28" : "7",
            price: pet.planPrice || 0,
            protein: pet.protein || "",
            bowlSize: pet.bowlSize || "",
        },
      }, {
        onSuccess: (data) => {
          console.log('Pet created successfully:', data);
          // setShowPaymentDetails(true);
          // setIsSubmittingAddress(false);
        },
        onError: (error) => {
          console.error('Error updating address:', error);
          // setIsSubmittingAddress(false);
        },
      });
    })

  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <Typography tag="p" text="Loading address data..." />
    </div>;
  }

  console.log("Pet data in shipping details page is", pets);

  return (
    <div className="flex flex-col gap-[var(--space-30-60)]">
      <Typography
        tag="h5"
        text="Shipping Details"
        className="uppercase text-primary-dark"
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--space-30-52)]">
        <InputLabeled
          name="firstName"
          label="First Name" 
          placeholder="Enter your first name" 
          variant="roundedEdgeInput" 
          value={shippingFormData.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shippingErrors.firstName}
        />

        <InputLabeled
          name="lastName"
          label="Last Name" 
          placeholder="Enter your last name" 
          variant="roundedEdgeInput" 
          value={shippingFormData.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shippingErrors.lastName}
        />

        <InputLabeled 
          name="mobile"
          label="Mobile Number" 
          placeholder="Enter your mobile number" 
          variant="roundedEdgeInput" 
          value={shippingFormData.mobile}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shippingErrors.mobile}
        />

        <div className='flex flex-col gap-[var(--space-8-17)]'>
          <InputLabeled
            name="address"
            label="Address" 
            placeholder="Address*" 
            variant="roundedEdgeInput"
            value={shippingFormData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shippingErrors.address}
          />

          <InputLabeled
            name="aptSuite"
            variant='roundedEdgeInput' 
            placeholder='Apt, Suite*' 
            className='bg-white'
            value={shippingFormData.aptSuite}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shippingErrors.aptSuite}
          />

          <InputLabeled
            name="municipality"
            variant='roundedEdgeInput' 
            placeholder='Municipality*' 
            className='bg-white'
            value={shippingFormData.municipality}
            onChange={handleChange}
            onBlur={handleBlur}
            error={shippingErrors.municipality}
          />
        </div>

        <AlertBar 
          text="My billing details different from shipping address" 
          selectedCheckBox={selectedCheckBox} 
          setSelectedCheckBox={setSelectedCheckBox} 
        />

        <BillingDetails
          billingFormData={billingFormData}
          setBillingFormData={setBillingFormData}
          isSynced={!selectedCheckBox}
          billingErrors={billingErrors}
          setBillingErrors={setBillingErrors}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmittingAddress}
        >
          {isSubmittingAddress ? "Loading..." : "Continue"}
        </Button>
      </form>

      {showPaymentDetails && <Payment />}
    </div>
  );
}