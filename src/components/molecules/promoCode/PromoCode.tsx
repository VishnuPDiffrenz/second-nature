import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import { useGetPromoOffer } from '@/hooks/subscriptionHooks/getPromoOfferHook'

interface PromoCodeProps {
  totalPrice: number;
  productPrice: number;
  setProductPrice: React.Dispatch<React.SetStateAction<number>>;
}

export default function PromoCode({ totalPrice, productPrice, setProductPrice }: PromoCodeProps) {
  const [promoCode, setPromoCode] = useState<string>("");
  const [isApplied, setIsApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState<string>("");
  const { 
    isLoading: isPromoOfferLoading,
    refetch: refetchPromoOffer
  } = useGetPromoOffer(promoCode);

  const handleApply = async () => {
    if (!promoCode.trim()) return;
    
    try {
      const { data } = await refetchPromoOffer();
      setPromoMessage(data?.message || "");
      console.log("Promo code response:", data);
      
      if (data?.result) {
        const discountAmount = calculateDiscount(productPrice, data?.result?.discount_percent);
        setProductPrice(productPrice - discountAmount);
        setIsApplied(true);
        console.log("Promo applied successfully. New price:", productPrice - discountAmount);
      } else {
        console.log("Invalid or expired promo code");
        // Show error to user
      }
    } catch (error) {
      console.error("Error applying promo code:", error);
      // Show error to user
    }
  };

  const calculateDiscount = (price: number, discountPercentage: number): number => {
    return price * (discountPercentage / 100);
  };

  const handleRemove = () => {
    setPromoCode("");
    setIsApplied(false);
    setPromoMessage("");
    setProductPrice(totalPrice);
  };

  return (
    <div className="w-full space-y-2"> {/* Changed to column layout with spacing */}
      <div className="relative w-full flex items-center gap-2">
        <Input
          placeholder="Referral or promo code"
          className="flex-1"
          variant="dottedInput"
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApply()}
          disabled={isApplied}
        />
        {isApplied ? (
          <Button 
            variant="outlinePrimaryBtn" 
            className="absolute right-1"
            onClick={handleRemove}
          >
            REMOVE
          </Button>
        ) : (
          <Button 
            variant="primaryBtn" 
            className="absolute right-1"
            onClick={handleApply}
            disabled={isPromoOfferLoading || !promoCode.trim()}
          >
            {isPromoOfferLoading ? "Applying..." : "APPLY"}
          </Button>
        )}
      </div>

      {promoMessage && (
        <div className="w-full text-sm text-green-600 dark:text-green-400">
          {promoMessage}
        </div>
      )}
    </div>
  );
}