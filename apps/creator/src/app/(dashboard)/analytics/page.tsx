"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/ui/chart";
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Icons } from "@/components/ui/icons";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("7d");

  const pageViews = [
    { date: "2023-05-01", views: 1200 },
    { date: "2023-05-02", views: 1300 },
    { date: "2023-05-03", views: 1400 },
    { date: "2023-05-04", views: 1600 },
    { date: "2023-05-05", views: 1500 },
    { date: "2023-05-06", views: 1700 },
    { date: "2023-05-07", views: 1800 },
  ];

  const contentEngagement = [
    { type: "Posts", engagement: 45 },
    { type: "Polls", engagement: 30 },
    { type: "Tiers", engagement: 15 },
    { type: "Goals", engagement: 10 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 1000 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: 2000 },
    { month: "Apr", revenue: 2500 },
    { month: "May", revenue: 3000 },
  ];

  return (
    <div className="container mx-auto p-6 bg-zinc-900 text-zinc-100">
      <motion.h1
        className="text-4xl font-bold mb-6 text-start"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Analytics Dashboard
      </motion.h1>

      <motion.div className="mb-6" {...fadeInUp}>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-zinc-800 text-zinc-100">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {[
          {
            title: "Total Views",
            icon: Icons.eye,
            value: "10,500",
            change: "+12%",
          },
          {
            title: "New Subscribers",
            icon: Icons.userPlus,
            value: "245",
            change: "+18%",
          },
          {
            title: "Engagement Rate",
            icon: Icons.barChart,
            value: "5.2%",
            change: "+2.1%",
          },
          {
            title: "Revenue",
            icon: Icons.dollarSign,
            value: "$4,325",
            change: "+7%",
          },
        ].map((item, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="bg-zinc-800 text-zinc-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-zinc-400">
                  {item.change} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card className="bg-zinc-800 text-zinc-100">
              <CardHeader>
                <CardTitle>Page Views Over Time</CardTitle>
                <CardDescription className="text-zinc-400">
                  Daily page views for the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    views: {
                      label: "Views",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pageViews}>
                      <XAxis dataKey="date" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="var(--color-views)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="content">
            <Card className="bg-zinc-800 text-zinc-100">
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription className="text-zinc-400">
                  Engagement distribution across different content types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    engagement: {
                      label: "Engagement",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={contentEngagement}
                        dataKey="engagement"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="var(--color-engagement)"
                        label
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="revenue">
            <Card className="bg-zinc-800 text-zinc-100">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription className="text-zinc-400">
                  Revenue trends over the past months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" stroke="#888888" />
                      <YAxis stroke="#888888" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
