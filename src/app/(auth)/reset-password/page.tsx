"use client";
import Typography from "@/components/atoms/typography/Typography";
import AuthLayout from "@/components/templates/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useSendEmailForPassword } from "@/hooks/authHooks/sendEmailForPasswordHook";

export default function Page() {

  const router = useRouter();

  const { mutate: sendEmailForPassword } = useSendEmailForPassword();

  // Add state to track whether the reset link has been sent
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [mailId, setMailId] = useState("");
  const [mailSendError, setMailSendError] = useState("");

  // Handle button click
  const handleResetClick = () => {
    sendEmailForPassword(
      {
        emailId: mailId
      },
      {
        onSuccess: () => {
          setIsLinkSent(true);
        },
        onError: () => {
          setIsLinkSent(false);
          setMailSendError("Error in sending mail");
        }
      }
    )
  };

  return (
    <AuthLayout>
      <div className="flex flex-col bg-[#F3F5E8] h-full lg:w-[31.25vw] rounded-2xl p-12">
        <div className="flex flex-col text-center sm:text-start pb-[var(--space-27-34)]">
          <div className="flex gap-2 pb-[var(--space-16-24)]">
            <Typography
              tag="h3"
              text="Reset Your"
              className="font-bold text-primary-dark"
            />
            <Typography
              tag="h3"
              text="Password"
              className="highlight font-bold text-primary-dark"
            />
          </div>
          
          {/* Conditionally render input and button or confirmation message */}
          {!isLinkSent ? (
            <div>
              <div className="flex flex-col gap-2 sm:pr-7 pb-[var(--space-16-24)]">
                <Input
                  value={mailId}
                  onChange={(e) => setMailId(e.target.value)}
                  variant="roundedEdgeInput"
                  placeholder="Account mail"
                />
              </div>
              <Button
                size={"small"}
                variant={"primaryBtn"}
                className="mx-auto sm:ml-0"
                onClick={handleResetClick}
              >
                Reset Password
              </Button>
              {
                mailSendError && 
                <Typography 
                  tag="p" 
                  text={mailSendError} 
                  className="text-red-600 mt-2" 
                />
              }
            </div>
          ) : (
            <Typography
              tag="p"
              text="A reset password link has been sent to your email."
              className=" lg:w-[66%]"
            />
          )}
        </div>
        <div 
          className="!cursor-pointer"
          onClick={() => startTransition(() => {
            router.push("/login");
          })}
        >
          <Typography 
            tag="span" 
            text="Return to Login" 
            className="underline text-center sm:text-start" 
          />
        </div>
      </div>
    </AuthLayout>
  );
}