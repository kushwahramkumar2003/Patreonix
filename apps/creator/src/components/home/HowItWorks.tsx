// components/HowItWorks.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up and set up your creator profile in minutes.",
  },
  {
    title: "Upload Your Content",
    description:
      "Share your creations with your audience using our easy-to-use tools.",
  },
  {
    title: "Set Up Subscriptions",
    description:
      "Choose your subscription tiers and pricing to monetize your content.",
  },
  {
    title: "Engage Your Community",
    description: "Interact with your subscribers and grow your fanbase.",
  },
];

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      steps.forEach((_, index) => {
        //@ts-ignore
        gsap.from(stepsRef.current[index], {
          opacity: 0,
          y: 50,
          duration: 0.5,
          scrollTrigger: {
            trigger: stepsRef.current[index],
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
        //@ts-ignore
        gsap.to(stepsRef.current[index].querySelector(".step-progress"), {
          width: "100%",
          duration: 1,
          scrollTrigger: {
            trigger: stepsRef.current[index],
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-zinc-800 to-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-zinc-300">
            Get started with Patreonix in four easy steps.
          </p>
        </div>

        <div className="mt-20 space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              //@ts-ignore
              ref={(el) => (stepsRef.current[index] = el)}
              className="relative"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-zinc-700 rounded-full">
                  <span className="text-xl font-bold text-zinc-100">
                    {index + 1}
                  </span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-zinc-300">{step.description}</p>
                </div>
              </div>
              <div className="absolute left-6 top-12 w-0.5 h-full bg-zinc-700 -z-10">
                <div className="step-progress w-0 h-full bg-zinc-400"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
