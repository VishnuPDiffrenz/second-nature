import { DropDownLabeled } from "@/components/molecules/dropDownLabeled/DropDownLabeled";
import { InputLabeled } from "@/components/molecules/inputLabeled/InputLabeled";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React,{ useState, useEffect } from "react";
import DateOfBirthPicker from "@/components/molecules/datePicker/DatePicker";
import Counter from "@/components/molecules/counterBuyingFlow/Counter";
import { useUpdatePetByPetIdHook } from "@/hooks/subscriptionHooks/updatePetDetailsByPetId";
// import Typography from "@/components/atoms/typography/Typography";
import { toast } from "sonner";

interface PetData {
  _id?: string;
  name?: string;
  gender?: string;
  type?: string;
  dateOfBirth?: string;
  ageMonth?: number;
  ageYear?: number;
  currentWeight?: number;
}

interface EditPetInfoProps {
  setIsEditPetInfo: (value: boolean) => void;
  petData?: PetData;
}

export default function EditPetInfo({ setIsEditPetInfo, petData }: EditPetInfoProps) {

  const { mutate: updatePet } = useUpdatePetByPetIdHook();

  const [ formData, setFormData ] = useState({
    user_id: "",
    name: "",
    type: "",
    gender: "",
    location: "",
    dateOfBirth: "",
    ageMonth: 0,
    ageYear: 0,
    breed: "",
    crossBreeds: [],
    activityLevel: "",
    currentWeight: 0,
    targetWeight: 0,
    plan: {
      type: "",
      duration: "",
      price: 0,
      protein: "",
      bowlSize: ""
    }
  });
  const [ updatePetLoading, setUpdatePetLoading ] = useState<boolean>(false);
  // const [ updatePetError, setUpdatePetError ] = useState<string>("");

  // Initialize form with petData
  useEffect(() => {
    if (petData) {
      setFormData(prev => ({
        ...prev,
        ...petData
      }));
    }
  }, [petData]);

  const handleDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      dateOfBirth: date,
      ageMonth: 0,  // Clear age fields
      ageYear: 0    // Clear age fields
    }));
  };

  const handleAgeMonthChange = (value: number) => {
    setFormData(prev => {
      // Only clear date if we're setting a non-zero value
      const shouldClearDate = value > 0 || prev.ageYear > 0;
      return {
        ...prev,
        ageMonth: value,
        dateOfBirth: shouldClearDate ? "" : prev.dateOfBirth
      };
    });
  };

  const handleAgeYearChange = (value: number) => {
    setFormData(prev => {
      // Only clear date if we're setting a non-zero value
      const shouldClearDate = value > 0 || prev.ageMonth > 0;
      return {
        ...prev,
        ageYear: value,
        dateOfBirth: shouldClearDate ? "" : prev.dateOfBirth
      };
    });
  };

  const handleUpdatePetInfo = () => {

    setUpdatePetLoading(true);

    updatePet(
      {
        petId: petData?._id || "",
        formData: {
          ...petData,
          user_id: formData.user_id || "",
          name: formData.name,
          type: formData.type,
          gender: formData.gender,
          location: formData.location || "",
          dateOfBirth: formData.dateOfBirth,
          ageMonth: formData.ageMonth,
          ageYear: formData.ageYear,
          breed: formData.breed || "",
          crossBreeds: formData.crossBreeds || [],
          activityLevel: formData.activityLevel || "",
          currentWeight: formData.currentWeight,
          targetWeight: formData.targetWeight || 0,
          plan: formData.plan || {
            type: "",
            duration: "",
            price: 0,
            protein: "",
            bowlSize: ""
          }
        }
      },
      {
        onSuccess: (data) => {
          if(data?.statusCode === 200) {
            toast.success(data.message || "Pet updated successfully");
          } else {
            toast.error(data.message || "Failed to update pet.Try again.");
          }
          setUpdatePetLoading(false);
          setIsEditPetInfo(false);
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update pet.Try again.");
          setUpdatePetLoading(false);
          setIsEditPetInfo(true);
        }
      }
    )
  }

  return (
      <div className="lg:w-[100%] grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 mt-5 mb-[var(--space-30-60)]">
        <InputLabeled
          label="Pet Name"
          placeholder="Type your Pet Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          // className="sm:col-span-2"
        />
        <DropDownLabeled
          placeholder="Select gender"
          label="Male or Female?"
          value={formData.gender}
          onValueChange={(value) => setFormData({ ...formData, gender: value })}
          options={[
            { value: "male", label: "male" },
            { value: "female", label: "female" },
          ]}
          className="capitalize"
        />
        <DropDownLabeled
          placeholder="Select species"
          label="Dog or Cat?"
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          options={[
            { value: "cat", label: "cat" },
            { value: "dog", label: "dog" },
          ]}
        />
        <InputLabeled 
          label="Weight" 
          placeholder="Enter weight"
          value={formData.currentWeight}
          onChange={(e) => setFormData({ ...formData, currentWeight: Number(e.target.value) })}
        />

        {/* <InputLabeled label="Birthday" placeholder="" /> */}

        <div className="w-full">
          <Label>Birthday</Label>
          <DateOfBirthPicker 
            dateOfBirth={formData.dateOfBirth} 
            setDateOfBirth={handleDateChange} 
            colorClass=" text-primary-dark placeholder-[#7C7C7C] placeholder:font-medium focus:placeholder-slate-300" 
            className="!w-full !h-14 !rounded-xl" 
          />
        </div>

        <div className="flex flex-col">
          <Label>Age</Label>
          <div className="flex flex-col lg:flex-row gap-3">
            <Counter 
              label="Months" 
              min={0} 
              max={12} 
              value={formData.ageMonth} 
              setValue={handleAgeMonthChange} 
              colorClass=" text-primary-dark  placeholder-[#7C7C7C] placeholder:font-medium focus:placeholder-slate-300 !font-normal"
              className1="!rounded-xl !h-14 !px-3" 
              className2="!gap-1" 
              className3="!w-7" 
            />
            <Counter 
              label="Years" 
              min={0} 
              max={100} 
              value={formData.ageYear} 
              setValue={handleAgeYearChange} 
              colorClass=" text-primary-dark  placeholder-[#7C7C7C] placeholder:font-medium focus:placeholder-slate-300 !font-normal"
              className1="!rounded-xl !h-14 !px-3"
              className2="!gap-1" className3="!w-7"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant={"whiteBtnSecondary2BorderAndText"} 
            size={"md"} 
            className="w-fit mt-6"
            onClick={() => handleUpdatePetInfo()}
          >
            { updatePetLoading ? "Updating..." : "Update Pet Information" }
          </Button>
          <Button 
            variant={"outlinePrimaryBtn"} 
            size={"md"}
            className="w-fit mt-6 text-secondary-1"
            onClick={() => setIsEditPetInfo(false)}
          >
            Cancel
          </Button>
        </div>

        {/* <Typography 
          tag="p" 
          text={updatePetError}
          className="text-red-500 text-sm mt-2 lg:col-span-2" 
        /> */}

      </div>
  );
}