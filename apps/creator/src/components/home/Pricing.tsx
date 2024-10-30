// components/Pricing.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@repo/ui/components/ui/Button";

const pricingPlans = [
  {
    name: "Starter",
    price: "$9",
    features: [
      "Basic creator tools",
      "Up to 100 subscribers",
      "Standard support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    features: [
      "Advanced creator tools",
      "Up to 1,000 subscribers",
      "Priority support",
      "Analytics dashboard",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "Full suite of creator tools",
      "Unlimited subscribers",
      "Dedicated support",
      "Advanced analytics",
      "API access",
    ],
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-b from-zinc-800 to-zinc-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-zinc-100 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-zinc-300">
            Find the perfect plan to support your creative journey.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-800 p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-zinc-100">
                {plan.name}
              </h3>
              <p className="mt-4 text-4xl font-bold text-zinc-100">
                {plan.price}
                <span className="text-xl font-normal text-zinc-400">
                  /month
                </span>
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-zinc-300"
                  >
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="cta" size="lg" className="w-full">
                  Get Started
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
