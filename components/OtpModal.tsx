"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, X } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  sendEmailAuthenticationCode,
  verifySecret,
} from "@/lib/actions/user.actions";
import { useAuth } from "@/lib/contexts/AuthContext";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { refreshUser } = useAuth();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const sessionId = await verifySecret({ accountId, password });
      if (sessionId) {
        refreshUser();
        router.push(redirectUrl);
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await sendEmailAuthenticationCode(accountId, email);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 shadow-2xl">
        {/* Close Button */}
        <AlertDialogCancel
          onClick={handleClose}
          className="absolute right-6 top-6 z-10 h-8 w-8 rounded-full border-0 bg-gray-100 p-0 text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </AlertDialogCancel>

        {/* Main Content */}
        <div className="flex flex-col items-center space-y-8 px-8 py-12">
          {/* Icon Container */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100 ring-8 ring-gray-50">
            <ShieldCheck className="h-10 w-10 text-gray-700" />
          </div>

          {/* Header Section */}
          <div className="space-y-3 text-center">
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-gray-900">
              Verify Your Identity
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed text-gray-600">
              We&apos;ve sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </AlertDialogDescription>
          </div>

          {/* OTP Input Section */}
          <div className="w-full flex justify-center">
            <InputOTP
              maxLength={6}
              value={password}
              onChange={setPassword}
              autoFocus
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot
                  index={0}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
                <InputOTPSlot
                  index={1}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
                <InputOTPSlot
                  index={2}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
                <InputOTPSlot
                  index={3}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
                <InputOTPSlot
                  index={4}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
                <InputOTPSlot
                  index={5}
                  className="h-14 w-12 rounded-xl border-2 border-gray-300 bg-white text-lg font-semibold text-gray-900 transition-colors focus:border-gray-500 focus:ring-2 focus:ring-gray-300/20"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-4">
            <AlertDialogAction
              onClick={handleSubmit}
              disabled={isLoading || password.length < 6}
              className="h-12 w-full rounded-xl bg-gradient-to-r from-gray-900 to-black text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-gray-800 hover:to-gray-900 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-300 disabled:shadow-none cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Image
                    src="/assets/icons/loader.svg"
                    alt="loader"
                    width={20}
                    height={20}
                    className="animate-spin"
                  />
                  <span>Verifying...</span>
                </div>
              ) : (
                "Verify Code"
              )}
            </AlertDialogAction>

            {/* Resend Section */}
            <div className="flex items-center justify-center space-x-1 text-sm">
              <span className="text-gray-500">
                Didn&apos;t receive the code?
              </span>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-sm font-semibold text-gray-900 hover:text-black hover:underline"
                onClick={handleResendOtp}
              >
                Resend Code
              </Button>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
