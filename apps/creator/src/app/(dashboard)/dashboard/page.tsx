"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Button from "@repo/ui/components/ui/Button";
import { AreaChart } from "../../../components/(dashboard)/dashboard/AreaChart";
import { DonutChart } from "../../../components/(dashboard)/dashboard/DonutChart";
import { RecentContent } from "../../../components/(dashboard)/dashboard/RecentContent";
import { BarChart } from "../../../components/(dashboard)/dashboard/BarChart";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  change,
  trend,
}: {
  title: string;
  value: string;
  icon: any;
  iconColor: string;
  change: string;
  trend: "up" | "down";
}) => (
  <Card className="bg-zinc-800 border-zinc-700">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-zinc-400">
        {title}
      </CardTitle>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-zinc-100">{value}</div>
      <div className="flex items-center text-xs mt-1">
        {trend === "up" ? (
          <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
        )}
        <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
          {change}
        </span>
      </div>
    </CardContent>
  </Card>
);

const areaChartData = [
  { name: "Jan", total: 1000 },
  { name: "Feb", total: 1500 },
  { name: "Mar", total: 2000 },
  { name: "Apr", total: 2500 },
  { name: "May", total: 3000 },
  { name: "Jun", total: 3500 },
];

const barChartData = [
  { name: "Mon", total: 200 },
  { name: "Tue", total: 300 },
  { name: "Wed", total: 400 },
  { name: "Thu", total: 500 },
  { name: "Fri", total: 600 },
  { name: "Sat", total: 700 },
  { name: "Sun", total: 800 },
];

const donutChartData = [
  { name: "Video", value: 400, color: "#8884d8" },
  { name: "Article", value: 300, color: "#82ca9d" },
  { name: "Podcast", value: 200, color: "#ffc658" },
  { name: "Live Stream", value: 100, color: "#ff8042" },
];

const recentContentData = [
  {
    title: "10 Tips for Better Content Creation",
    type: "Article",
    views: 1234,
    likes: 56,
    comments: 7,
    date: "2h ago",
  },
  {
    title: "How to Grow Your Audience",
    type: "Video",
    views: 5678,
    likes: 234,
    comments: 45,
    date: "1d ago",
  },
  {
    title: "Monetization Strategies for Creators",
    type: "Podcast",
    views: 3456,
    likes: 123,
    comments: 23,
    date: "3d ago",
  },
];

export default function DashboardPage() {
  const dashboardStats = [
    {
      title: "Total Subscribers",
      value: "1,234",
      icon: Users,
      iconColor: "text-indigo-500",
      change: "+20.1% from last month",
      trend: "up" as const,
    },
    {
      title: "Monthly Earnings",
      value: "$5,678",
      icon: DollarSign,
      iconColor: "text-green-500",
      change: "+15.3% from last month",
      trend: "up" as const,
    },
    {
      title: "Content Pieces",
      value: "42",
      icon: FileText,
      iconColor: "text-purple-500",
      change: "+3 new pieces this week",
      trend: "up" as const,
    },
    {
      title: "Avg. Engagement",
      value: "87%",
      icon: BarChart,
      iconColor: "text-yellow-500",
      change: "-2.5% from last month",
      trend: "down" as const,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-zinc-100">Creator Dashboard</h1>
        <Button variant="animated">Download Report</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AreaChart
          data={areaChartData}
          title="Subscriber Growth"
          description="Number of subscribers over time"
        />
        <BarChart
          data={barChartData}
          title="Weekly Earnings"
          description="Earnings breakdown by day of the week"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DonutChart
          data={donutChartData}
          title="Content Distribution"
          description="Breakdown of content types"
        />
        <RecentContent items={recentContentData} />
      </div>

      <Card className="bg-zinc-800 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-zinc-100">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Create Content",
              "Schedule Post",
              "View Analytics",
              "Manage Subscriptions",
            ].map((action, index) => (
              <motion.div
                key={action}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button variant="outline" className="w-full">
                  {action}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
