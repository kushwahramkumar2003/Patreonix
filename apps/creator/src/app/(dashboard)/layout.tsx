"use client";

import React, { useState } from "react";
import { Header } from "../../components/(dashboard)/dashboard/Header";
import { Sidebar } from "../../components/(dashboard)/dashboard/Sidebar";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-zinc-900 text-zinc-100">
      <div className="flex h-full flex-col">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1">
            <ScrollArea className="h-full">
              <div className="container mx-auto p-6 lg:p-8">{children}</div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </div>
  );
}
