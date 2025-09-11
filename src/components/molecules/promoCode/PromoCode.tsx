import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useGetPromoOffer } from '@/hooks/subscriptionHooks/getPromoOfferHook'
import Typography from '@/components/atoms/typography/Typography';
import { toast } from 'sonner';
import { usePetStore } from '@/zustand/store/petDataStore';

interface PromoCodeProps {
  totalPrice: number;
  productPrice: number;
  setProductPrice: React.Dispatch<React.SetStateAction<number>>;
  discountPercentage: number;
  regularPlanDiscountPrice: number;
}

export default function PromoCode({ totalPrice, productPrice, setProductPrice, discountPercentage, regularPlanDiscountPrice }: PromoCodeProps) {

  const { setPromocode } = usePetStore();
  
  const [promoCodeValue, setPromoCodeValue] = useState<string>("");
  const [isApplied, setIsApplied] = useState(false);
  const [promoCodeDiscountAmount, setPromoCodeDiscountAmount] = useState<number>(0);
  // const [promoMessage, setPromoMessage] = useState<string>("");
  const { 
    isLoading: isPromoOfferLoading,
    refetch: refetchPromoOffer
  } = useGetPromoOffer(promoCodeValue);

  const handleApply = async () => {
    if (!promoCodeValue.trim()) return;

    setPromocode(promoCodeValue);
    
    try {
      const { data } = await refetchPromoOffer();
      
      if (data?.result) {
        const discountAmount = calculateDiscount(productPrice, data?.result?.discount_percent);
        setPromoCodeDiscountAmount(discountAmount);
        setProductPrice(productPrice - discountAmount);
        toast.success("Promo code applied successfully");
        setIsApplied(true);
      } else {
        toast.error("Invalid or expired promo code");
      }
    } catch (error) {
      toast.error("Error applying promo code");
      console.error("Error applying promo code:", error);
    }
  };

  const calculateDiscount = (price: number, discountPercentage: number): number => {
    return price * (discountPercentage / 100);
  };

  const handleRemove = () => {
    toast.error("Promo code removed");
    setPromoCodeValue("");
    setPromocode("");
    setIsApplied(false);
    // setPromoMessage("");
    setProductPrice(totalPrice);
    setPromoCodeDiscountAmount(0);
  };

  return (
    <div className="w-full space-y-2"> {/* Changed to column layout with spacing */}
      <div className="relative w-full flex items-center gap-2">
        <Input
          placeholder="Referral or promo code"
          className="flex-1 bg-white max-[575px]:text-[15px]"
          variant="dottedInput"
          value={promoCodeValue}
          onChange={(e) => {
            setPromoCodeValue(e.target.value);
            // setPromoMessage("");
          }}
          // onKeyDown={(e) => e.key === "Enter" && handleApply()}
          disabled={isApplied}
        />
        {isApplied ? (
          <Button 
            variant="primaryBtn" 
            className="absolute right-1 max-[575px]:px-3"
            onClick={handleRemove}
          >
            REMOVE
          </Button>
        ) : (
          <Button 
            variant="primaryBtn" 
            className="absolute right-1 max-[575px]:px-3"
            onClick={handleApply}
            disabled={isPromoOfferLoading || !promoCodeValue.trim()}
          >
            {isPromoOfferLoading ? "Applying..." : "APPLY"}
          </Button>
        )}
      </div>

      {/* {promoMessage && (
        <div className="w-full text-sm text-green-600 dark:text-green-400">
          {promoMessage}
        </div>
      )} */}

      <div className='flex flex-col gap-3 lg:gap-2 pt-5'>
        <div className='flex items-center justify-between'>
          <Typography tag='p' text='Promotion Code' className='text-primary-dark font-semibold'/>
          <Typography tag='p' text={`-${promoCodeDiscountAmount} QAR`} className='text-primary-dark text-end font-semibold'/>
        </div>


        <div className='flex items-center justify-between'>
          <Typography tag='p' text={`${discountPercentage}% Off Your First Month`} className='text-primary-dark font-semibold'/>
          <Typography tag='p' text={`-${regularPlanDiscountPrice} QAR`} className='text-primary-dark text-end font-semibold'/>
        </div>
        <div className='flex items-center justify-between'>
          <Typography tag='p' text='Shipping' className='text-primary-dark font-semibold'/>
          <Typography tag='p' text='0 QAR' className='text-primary-dark text-end font-semibold'/>
        </div>
        <div className='flex items-center justify-between'>
          <Typography tag='p' text='Tax' className='text-primary-dark font-semibold'/>
          <Typography tag='p' text='0 QAR' className='text-primary-dark text-end font-semibold'/>
        </div>
      </div>
    </div>
  );
}