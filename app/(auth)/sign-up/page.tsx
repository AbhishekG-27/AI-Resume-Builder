import AuthForm from "@/components/AuthForm";
import Image from "next/image";
import React, { Suspense } from "react";

const SignUp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full h-full flex">
        <section className="hidden md:block w-1/2 relative">
          <Image
            src="/images/auth.webp"
            alt="Auth Image"
            fill
            className="object-cover"
          />
        </section>
        <section className="w-1/2 flex items-center justify-center h-screen">
          <AuthForm type="sign-up" />
        </section>
      </div>
    </Suspense>
  );
};

export default SignUp;
