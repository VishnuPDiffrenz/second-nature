"use client";
import Typography from "@/components/atoms/typography/Typography";
import AuthLayout from "@/components/templates/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { startTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/authHooks/forgotPasswordHook";

export default function Page() {

  const router = useRouter();
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    // This runs only on client side after component mounts
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get('emailId') || "");
  }, []);

  const { mutate: forgotPassword } = useForgotPassword();

  const [isLinkSent, setIsLinkSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const handleResetClick = () => {
    setIsLinkSent(true);
    forgotPassword(
      {
        formData: {
          userId: userId,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword
        }
      },
      {
        onSuccess: () => {
          setIsLinkSent(true);
          setForgotPasswordError("");
        },
        onError: () => {
          setIsLinkSent(false);
          setForgotPasswordError("Error in changing password");
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
              text="Change Your"
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
                  type="password"
                  name="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  variant="roundedEdgeInput" 
                  placeholder="New Password" 
                />
              </div>
              <div className="flex flex-col gap-2 sm:pr-7 pb-[var(--space-16-24)]">
                <Input
                  type="password"
                  name="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  variant="roundedEdgeInput" 
                  placeholder="Repeat Password" 
                />
              </div>
              <Button
                size={"small"}
                variant={"primaryBtn"}
                className="mx-auto sm:ml-0"
                onClick={handleResetClick}
              >
                Update Password
              </Button>
              {forgotPasswordError && (
                <Typography
                  tag="p"
                  text={forgotPasswordError}
                  className="text-red-600 mt-2"
                />
              )}
            </div>
          ) : (
            <>
                <Typography
                    tag="p"
                    text="Password has been updated."
                    className=" lg:w-[66%]"
                />
                <Typography
                    tag="p"
                    text="Please login again."
                    className=" lg:w-[66%]"
                />
            </>
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