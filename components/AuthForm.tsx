"use client";
import React, { Suspense, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAccount, getAccount } from "@/lib/actions/user.actions";
import OtpModal from "./OtpModal";
import Image from "next/image";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { createSessionClient } from "@/lib/appwrite";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

type AuthTypes = "sign-in" | "sign-up";

const formSchema = (authType: AuthTypes) => {
  return z.object({
    // Use the standard z.string().email() for validation
    email: z.string().email("Please enter a valid email address"),
    fullName:
      authType === "sign-up"
        ? z.string().min(2, "Full name is required")
        : z.string().optional(),
  });
};

export default function AuthForm({ type }: { type: AuthTypes }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const authFormSchema = formSchema(type);

  // 1. Define your form and get access to formState.errors
  const form = useForm<z.infer<typeof authFormSchema>>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      fullName: "",
    },
  });

  // Destructure errors from formState for easier access
  const {
    formState: { errors },
  } = form;

  // 2. Define a submit handler.
  // Corrected the type inference here
  const onSubmit = async (values: z.infer<typeof authFormSchema>) => {
    setIsLoading(true);
    try {
      const user = await createSessionClient();
      if (user) {
        setError("User already logged in");
        setTimeout(() => {
          setError(null);
          router.push(redirectUrl);
        }, 3000);
      }

      if (type === "sign-up") {
        const { fullName, email } = values;
        const user = await createAccount({
          fullName: fullName || "",
          email: email || "",
        });
        if (user.redirect) {
          setError("User already exists. Please sign in.");
          setTimeout(() => {
            router.push("/sign-in");
            setError(null);
          }, 3000);
        } else {
          await refreshUser();
          setUserId(user.accountId);
          setEmail(email);
          setFullName(fullName || "");
        }
      } else if (type === "sign-in") {
        // Handle sign-in logic here
        const { email } = values;
        const user = await getAccount(email);
        if (user.id) {
          await refreshUser();
          setUserId(user.id);
          setEmail(email);
        } else {
          setError("User does not exist. Please sign up.");
          setTimeout(() => {
            setError(null);
            router.push("/sign-up");
          }, 3000);
        }
      }
    } catch (error) {
      // Handle error appropriately, e.g., show a notification
      setError("An unexpected error occurred: " + (error as Error).message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto w-full max-w-md bg-white p-8 rounded-2xl inset-shadow">
        <h2 className="text-xl font-bold text-black">Welcome to AutoCv</h2>
        <p className="mt-2 max-w-sm text-sm text-dark-200">
          {type === "sign-in" ? "Sign in" : "Sign up"} to AutoCv
        </p>

        <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
          {type === "sign-up" && (
            <LabelInputContainer>
              <Label htmlFor="fullName">Enter your name</Label>
              {/* 2. Register the input */}
              <Input
                id="fullName"
                placeholder="John Doe"
                type="text"
                className="w-full"
                {...form.register("fullName")}
              />
              {/* 3. Display the error message */}
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </LabelInputContainer>
          )}
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            {/* 2. Register the input */}
            <Input
              id="email"
              placeholder="john@example.com"
              type="email"
              {...form.register("email")}
            />
            {/* 3. Display the error message */}
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </LabelInputContainer>

          <button
            className={`relative block h-12 w-full rounded-2xl bg-gradient-to-r from-[#AB8C95] via-[#000000] to-[#8E97C5] font-medium text-white transition-all duration-200 hover:opacity-90 ${
              isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
            }`}
            type="submit"
            disabled={isLoading}
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
              </div>
            ) : (
              <span>{type === "sign-up" ? "Sign up" : "Sign in"}</span>
            )}
          </button>

          <div className="my-2 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <div className="flex w-full items-center justify-center gap-1">
            <p className="text-sm text-dark-200">
              {type === "sign-up"
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>
            <Link
              className="text-sm font-medium text-black hover:underline"
              href={type === "sign-up" ? "/sign-in" : "/sign-up"}
            >
              {type === "sign-up" ? "Sign in" : "Sign up"}
            </Link>
          </div>
        </form>
        {userId && <OtpModal accountId={userId} email={email} fullName={fullName} />}
      </div>
      {error && (
        <Alert variant="destructive" className="fixed bottom-4 right-4 w-md">
          <Terminal />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Suspense>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};
