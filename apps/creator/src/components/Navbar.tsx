"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@repo/ui/components/ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { WalletDialog } from "./(dashboard)/dashboard/WalletDialog";

const Navbar = () => {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-zinc-900/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text"
            >
              Patreonix
            </a>
          </div>
          <div className="hidden md:block">
            {data?.user ? (
              <div className="flex flex-row gap-3 justify-center items-center">
                <WalletDialog />
                <Button
                  variant="cosmic"
                  size="md"
                  onClick={() => {
                    router.push("/dashboard");
                  }}
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="ml-10 flex items-baseline space-x-4">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    router.push("/login");
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="cosmic"
                  size="md"
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-zinc-800"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* <a
                href="#features"
                className="hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                How It Works
              </a>
              <a
                href="#showcase"
                className="hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Showcase
              </a>
              <a
                href="#pricing"
                className="hover:bg-zinc-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                Pricing
              </a> */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Sign In
              </Button>
              <Button
                variant="cosmic"
                size="sm"
                className="w-full mt-2"
                onClick={() => {
                  router.push("/register");
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
