import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import React, { Suspense } from "react";

const SignIn = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-screen flex">
        <section className="hidden md:block w-1/2 relative">
          <Image
            src="/images/auth.webp"
            alt="Auth Image"
            fill
            className="object-cover"
          />
        </section>
        <section className="w-full md:w-1/2 flex items-center justify-center min-h-screen">
          <AuthForm type="sign-in" />
        </section>
      </div>
    </Suspense>
  );
};

export default SignIn;
