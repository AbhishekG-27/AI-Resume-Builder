"use client";

import React, { useEffect, useRef, useState } from "react";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2, // Trigger when 10% of the component is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it's fully in view
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Analyze 2 resumes per month",
        "Basic templates",
        "PDF export",
        "Email support",
        "Basic customization",
      ],
      buttonText: "Get Started",
      popular: false,
      buttonStyle: "bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer",
    },
    {
      name: "Seeker",
      price: "₹100",
      period: "per month",
      description: "Best for active job seekers",
      features: [
        "Analyze 50 resumes per month",
        "Premium templates",
        "AI-powered suggestions",
        "Cover letter builder",
        "Priority support",
        "Advanced customization",
        "LinkedIn optimization",
      ],
      buttonText: "Get Seeker",
      popular: true,
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer",
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 transition-all duration-700 ${
          isVisible ? 'animate-in slide-in-from-left-5' : 'opacity-0 translate-x-[-20px]'
        }`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to accelerate your job search and build the
            resume that gets you hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? "ring-2 ring-blue-500 scale-105" : ""
              } ${
                isVisible ? 'animate-in slide-in-from-left-5' : 'opacity-0 translate-x-[-20px]'
              }`}
              style={{
                animationDelay: isVisible ? `${index * 200}ms` : '0ms',
                animationDuration: '600ms',
                animationFillMode: 'both'
              }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`text-center mt-12 transition-all duration-700 ${
          isVisible ? 'animate-in slide-in-from-left-5' : 'opacity-0 translate-x-[-20px]'
        }`} style={{animationDelay: isVisible ? '800ms' : '0ms', animationFillMode: 'both'}}>
          <p className="text-gray-600 mb-4">
            All plans come with a 14-day money-back guarantee
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>✓ No setup fees</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Secure payment</span>
            <span>✓ 24/7 support</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
