// components/CallToAction.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Button from "@repo/ui/components/ui/Button";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-zinc-900 to-zinc-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text"
        >
          Ready to Start Your Creative Journey?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl text-zinc-300"
        >
          Join thousands of creators who are building their dreams on Patreonix.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10"
        >
          <Button variant="cosmic" size="lg">
            Get Started Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
