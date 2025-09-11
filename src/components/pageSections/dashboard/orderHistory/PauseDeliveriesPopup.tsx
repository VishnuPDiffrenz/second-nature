import React, { useEffect, useState } from "react";
// import { format } from "date-fns";
// import { format, endOfWeek, addWeeks, addDays } from "date-fns";
// import { format, startOfWeek, endOfWeek, addWeeks, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popup } from "@/components/molecules/popupSkelton/popup";
import Typography from "@/components/atoms/typography/Typography";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import Image from "next/image";
// import WeeklyRangeSelector from "@/components/molecules/weekDateRangePicker/WeeklyRangeSelector";
import RangeDatePicker from "@/components/molecules/weekDateRangePicker/WeeklyRangeSelector";
import ProceedCheck from "@/components/organism/popUp/ProceedCheck";

// Types
// type WeekOption = "1week" | "2weeks" | "3weeks" | "4weeks" | "custom";

interface DateRange {
  from: Date;
  to: Date;
  weeks?: number;
}

interface PauseDeliveriesPopupProps {
  isOpen: boolean;
  formattedPossiblePauseDate?: string; // Optional: if you want to display the next possible pause date
  setIsPausePopUpOpen?: (open: boolean) => void; // Optional: if you want to control the open state from parent
  onClose: () => void;
  onConfirm: (dateRange: { from: string; to: string }, weeks: number, reason: string) => void;
  initialRange?: DateRange;
  nextDeliveryDate?: string;
}

export const PauseDeliveriesPopup: React.FC<PauseDeliveriesPopupProps> = ({
  isOpen,
  formattedPossiblePauseDate,
  setIsPausePopUpOpen,
  onClose,
  onConfirm,
  // initialRange,
}) => {
  const today = new Date();

  const [isWeekSelected, setIsWeekSelected] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [weeks, setWeeks] = useState<number>(0);
  const [reason,] = useState<string>("");
  const [showProceedCheck, setShowProceedCheck] = useState<boolean>(false);

  function formatDate(dateString: string) {
    if (!dateString) return "";

    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }

    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = parsedDate.toLocaleString('en-GB', { month: 'short' });
    const year = parsedDate.getFullYear();

    return `${day}.${month}.${year}`;
  }

  const formattedFromDate = dateRange.from ? formatDate(dateRange.from) : "";
  const formattedToDate = dateRange.to ? formatDate(dateRange.to) : "";

  const handleSubmit = () => {
    onConfirm(dateRange, 0, reason);
    // if (isWeekSelected === true) {
    //   onConfirm({from: "", to: ""}, weeks, reason)
    // } else if (isWeekSelected === false) {
    //   onConfirm(dateRange, 0, reason)
    // }
  };



  // const handleWeekOptionChange = (value: WeekOption) => {
  //   setSelectedOption(value);
  //   setIsWeekSelected(true);

  //   if (value !== "custom") {
  //     const weekCount = parseInt(value.replace("week", ""), 7);

  //     setDateRange({
  //       from: startOfWeek(today, { weekStartsOn: 1 }),
  //       to: endOfWeek(addWeeks(today, weekCount), { weekStartsOn: 1 }),
  //     });
  //   }
  // };

  // const handleWeekOptionChange = (value: WeekOption) => {
  //   setSelectedOption(value);
  //   setIsWeekSelected(true);

  //   if (value !== "custom") {
  //     // let daysToAdd = 0;
  //     switch (value) {
  //       case "1week":
  //         setWeeks(1);
  //         // daysToAdd = 7;
  //         break;
  //       case "2weeks":
  //         setWeeks(2);
  //         // daysToAdd = 14;
  //         break;
  //       case "3weeks":
  //         setWeeks(3);
  //         // daysToAdd = 21;
  //         break;
  //       case "4weeks":
  //         setWeeks(4);
  //         // daysToAdd = 28;
  //         break;
  //       default:
  //         break;
  //     }

  //     setDateRange({
  //       from: "",
  //       to: "",
  //     });

  //     // setRange({
  //     //   from: undefined,
  //     //   to: undefined
  //     // })

  //   }
  // };

  useEffect(() => {
    console.log("Calender range and weeks", dateRange, weeks);
  }, [dateRange, weeks]);

  console.log("Is week selected", isWeekSelected);

  const minPauseDate = formattedPossiblePauseDate ? new Date(formattedPossiblePauseDate) : today;

  return (
    <>

      <Popup
        isOpen={isOpen}
        onClose={() => {
          setDateRange({
            from: "",
            to: "",
          });
          onClose();
        }}
        // onClose={onClose}
        title="Pause My Deliveries"
        size="md"
        footer={
          <div className="flex justify-center w-full px-7 border-t border-[#d1d3c9] py-7 pt-5 mt-5">
            <Button
              onClick={() => {
                setShowProceedCheck(true);
                if (setIsPausePopUpOpen) setIsPausePopUpOpen(false); // Close the popup when proceeding
              }}
              // onClick={handleSubmit} 
              className="w-full bg-[#9C3A3A]"
              size="md"
              disabled={dateRange.from === "" || dateRange.to === ""}
            >
              Submit
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">

          <Typography
            tag="p"
            text={`Next possible pause date is ${formattedPossiblePauseDate || "not available"}`}
            className="text-lg font-semibold text-[#F15353] text-center"
          />

          <div>
            <Typography
              tag="p"
              text="Select Delivery Duration"
              className="text-sm mb-1"
            />
            {/* <WeeklyRangeSelector setDateRangeFromCalender={setDateRangeFromCalender} setIsWeekSelected={setIsWeekSelected} /> */}
            <RangeDatePicker
              setWeeks={setWeeks}
              setDateRange={setDateRange}
              setIsWeekSelected={setIsWeekSelected}
              minDate={minPauseDate}
              range={dateRange}
              setRange={setDateRange}
            />
          </div>

          {/* <div className="h-[0.5px] w-full bg-[#D1D3C9]"></div> */}

          {/* Duration Display */}
          {/* <div className="border border-[#9C3A3A] rounded-md p-4 mb-2 relative">
            <Typography
              tag="label"
              text="DURATION"
              className="font-normal uppercase absolute bg-[#FDFFF4] subtitle2 -top-[7px] left-1/2 transform -translate-x-1/2 px-1 text-[#9C3A3A]"
            />
            <div className="text-center text-[#00683D] font-medium h6">
              <h6>
                {formattedFromDate && formattedToDate ? (
                  <>
                    {formattedFromDate} <span className="text-text-color">to</span> {formattedToDate}
                  </>
                ) : (
                  <>
                    DD.MM.YYYY <span className="text-text-color">to</span> DD.MM.YYYY
                  </>
                )}
              </h6>


            </div>
          </div> */}

          {/* Week Selection */}
          {/* <RadioGroup
            value={selectedOption}
            onValueChange={(value) => handleWeekOptionChange(value as WeekOption)}
            className="flex flex-wrap gap-4"
          > */}
          {/* {[
              { value: "1week", label: "Next 1 week" },
              { value: "2weeks", label: "Next 2 weeks" },
              { value: "3weeks", label: "Next 3 weeks" },
              { value: "4weeks", label: "Next 4 weeks" },
            ].map(({ value, label }) => (
              <div key={value} className="flex items-center max-[575px]:space-x-1 space-x-2 w-[45%] lg:w-[45%] relative ">
                <RadioGroupItem value={value} id={`option-${value}`} className="sr-only" />
                <div
                  className="w-7 h-7 sm:w-7 sm:h-7 rounded-full p-1 cursor-pointer"
                  onClick={() => handleWeekOptionChange(value as WeekOption)}
                >
                  <Image
                    src={
                      selectedOption === value
                        ? "/icons/checked.svg"
                        : "/icons/unchecked-default.svg"
                    }
                    alt={selectedOption === value ? "checked" : "unchecked"}
                    fill
                    className="!static w-fit h-full"
                  />
                </div>
                <Label htmlFor={`option-${value}`} className="cursor-pointer mb-0 max-[575px]:!text-[13px]">
                  {label}
                </Label>
              </div>
            ))} */}

          {/* Separator */}
          {/* <div className="flex items-center my-2 w-full">
              <Separator className="flex-1 bg-[#d1d3c9]" />
              <span className="px-4 text-gray-500 text-sm uppercase">OR</span>
              <Separator className="flex-1 bg-[#d1d3c9]" />
            </div> */}

          {/* Custom Week Selector */}
          {/* <div className="flex items-center max-[575px]:space-x-1 space-x-2 w-full relative">
              <RadioGroupItem value="custom" id="option-custom" className="sr-only" />
              <div
                className="w-7 h-7 sm:w-7 sm:h-7 rounded-full p-1 cursor-pointer"
                onClick={() => handleWeekOptionChange("custom")}
              >
                <Image
                  src={
                    selectedOption === "custom"
                      ? "/icons/checked.svg"
                      : "/icons/unchecked-default.svg"
                  }
                  alt={selectedOption === "custom" ? "checked" : "unchecked"}
                  fill
                  className="!static w-fit h-full"
                />
              </div>
              <Label htmlFor="option-custom" className="cursor-pointer mb-0 max-[575px]:!text-[13px]">
                Select Week(s)
              </Label>
            </div> */}
          {/* </RadioGroup> */}




        </div>
      </Popup>

      {showProceedCheck && (
        <ProceedCheck
          isOpen={showProceedCheck}
          setIsOpen={setShowProceedCheck}
          setIsPausePopupOpen={setIsPausePopUpOpen}
          headingText="Pause Deliveries"
          subText="Your plan will be paused from,"
          firstButtonText="Make Changes"
          secondButtonText="Proceed"
          dateRangeText={`${formattedFromDate} to ${formattedToDate}`}
          handleSubmit={handleSubmit}
        />
      )}
    </>
  );
};