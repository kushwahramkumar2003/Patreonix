"use client";

import React from "react";
import { motion } from "framer-motion";
import RegisterForm from "../../../components/auth/RegisterForm";
import { Link } from "@repo/ui/components/ui/Link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text">
            Create Your Creator Account
          </h1>
          <p className="mt-2 text-zinc-400">
            Join the community and start sharing your creativity
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RegisterForm />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-sm text-zinc-400"
        >
          Already have an account?{" "}
          <Link href="/login" variant="default">
            Sign in
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
