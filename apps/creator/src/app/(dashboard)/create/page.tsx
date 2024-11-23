"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Icons } from "../../../components/ui/icons";
import { CreatePostForm } from "../../../components/(dashboard)/create/CreatePostForm";
import { CreatePollForm } from "../../../components/(dashboard)/create/CreatePollForm";
import { CreateTierForm } from "../../../components/(dashboard)/create/CreateTierForm";
import { CreateGoalForm } from "../../../components/(dashboard)/create/CreateGoalForm";
import { useSearchParams, useRouter } from "next/navigation";

export default function CreatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const typeFromURL = searchParams.get("type");

  const [activeTab, setActiveTab] = useState<"post" | "poll" | "tier" | "goal">(
    typeFromURL && ["post", "poll", "tier", "goal"].includes(typeFromURL)
      ? (typeFromURL as "post" | "poll" | "tier" | "goal")
      : "post"
  );

  const handleTabChange = (value) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("type", value);
    router.push(`/create?${newParams.toString()}`);
  };

  useEffect(() => {
    if (typeFromURL && ["post", "poll", "tier", "goal"].includes(typeFromURL)) {
      setActiveTab(typeFromURL as "post" | "poll" | "tier" | "goal");
    }
  }, [typeFromURL]);

  const tabContent = {
    post: {
      title: "Create a Post",
      description:
        "Share updates, behind-the-scenes content, or exclusive material with your patrons.",
      icon: <Icons.fileText className="w-6 h-6" />,
      component: <CreatePostForm />,
    },
    poll: {
      title: "Create a Poll",
      description:
        "Engage your community by creating polls and gathering feedback.",
      icon: <Icons.barChart className="w-6 h-6" />,
      component: <CreatePollForm />,
    },
    tier: {
      title: "Create a Tier",
      description:
        "Set up new membership tiers with unique benefits for your patrons.",
      icon: <Icons.layers className="w-6 h-6" />,
      component: <CreateTierForm />,
    },
    goal: {
      title: "Create a Goal",
      description:
        "Set financial or project-based goals to motivate your patrons.",
      icon: <Icons.target className="w-6 h-6" />,
      component: <CreateGoalForm />,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8"
    >
      <h1 className="text-3xl font-bold text-zinc-100 mb-6">Create Content</h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
          {Object.entries(tabContent).map(([key, { title, icon }]) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center justify-center gap-2 data-[state=active]:bg-zinc-700"
            >
              {icon}
              <span className="hidden sm:inline">{title}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value={activeTab} className="mt-6">
              <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                  <CardTitle className="text-2xl text-zinc-100">
                    {tabContent[activeTab].title}
                  </CardTitle>
                  <CardDescription>
                    {tabContent[activeTab].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>{tabContent[activeTab].component}</CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
}
