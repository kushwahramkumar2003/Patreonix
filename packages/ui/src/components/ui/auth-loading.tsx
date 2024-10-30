"use client";

import React from "react";
import { motion } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import { Wallet, ArrowRight } from "lucide-react";
import { WalletButton } from "@repo/ui/components/ui/wallet-button";

import Button from "@repo/ui/components/ui/Button";
import { Link } from "./Link";

export default function LoginPage() {
  const { connected, publicKey } = useWallet();

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
            Welcome Back Creator
          </h1>
          <p className="mt-2 text-zinc-400">
            Connect your wallet to access your creator dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-zinc-800/50 backdrop-blur-xl rounded-lg border border-zinc-700 p-6 shadow-xl"
        >
          {!connected ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-700">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center">
                    <Wallet className="w-8 h-8 text-zinc-300" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-zinc-200">
                      Connect Wallet
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      Use your Solana wallet to sign in securely
                    </p>
                  </div>
                  <WalletButton variant="large" />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-zinc-800/50 text-zinc-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  leftIcon={
                    <img src="/phantom.svg" alt="Phantom" className="w-5 h-5" />
                  }
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Phantom Wallet
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  leftIcon={
                    <img
                      src="/solflare.svg"
                      alt="Solflare"
                      className="w-5 h-5"
                    />
                  }
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Solflare Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-zinc-700/50 flex items-center justify-center mx-auto">
                  <Wallet className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-zinc-200">
                  Wallet Connected
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  {publicKey?.toBase58().slice(0, 8)}...
                  {publicKey?.toBase58().slice(-8)}
                </p>
              </div>
              <Button
                variant="animated"
                className="w-full"
                onClick={() => {
                  // Handle navigation to dashboard
                  window.location.href = "/dashboard";
                }}
              >
                Continue to Dashboard
              </Button>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-sm text-zinc-400"
        >
          Don't have an account?{" "}
          <Link href="/register" variant="default">
            Create one
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
