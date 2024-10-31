"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home,
  FileText,
  BarChart2,
  Settings,
  PlusCircle,
  DollarSign,
  X,
} from "lucide-react";

import { cn } from "@repo/ui/lib/utils";
import Button from "@repo/ui/components/ui/Button";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

// const navItems = [
//   { href: "/dashboard", icon: Home, label: "Dashboard" },
//   { href: "/dashboard/content", icon: FileText, label: "Content" },
//   { href: "/dashboard/create", icon: PlusCircle, label: "Create" },
//   { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics" },
//   { href: "/dashboard/earnings", icon: DollarSign, label: "Earnings" },
//   { href: "/dashboard/settings", icon: Settings, label: "Settings" },
// ];

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/content", icon: FileText, label: "Content" },
  { href: "/create", icon: PlusCircle, label: "Create" },
  { href: "/analytics", icon: BarChart2, label: "Analytics" },
  { href: "/earnings", icon: DollarSign, label: "Earnings" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 z-40 h-screen w-72 border-r border-zinc-700 bg-zinc-900 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-zinc-700 px-4 lg:hidden">
          <div className="text-xl font-bold bg-gradient-to-r from-zinc-200 to-zinc-400 text-transparent bg-clip-text">
            Patreonix
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-4rem)] pb-10 lg:h-screen">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="space-y-1">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-zinc-200">
                  Navigation
                </h2>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                      >
                        <div
                          className={cn(
                            "relative flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-zinc-800 text-zinc-100"
                              : "hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-100"
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5" />
                          {item.label}
                          {isActive && (
                            <motion.div
                              className="absolute left-0 top-1/2 h-full w-1 -translate-y-1/2 rounded-r-lg bg-zinc-400"
                              layoutId="activeNavIndicator"
                            />
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
