"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

//@ts-ignore
export function ContentAnalytics({ contentId }) {
  const [dateRange, setDateRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Simulated API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAnalyticsData({
        //@ts-ignore
        views: [
          { date: "2023-05-01", value: 100 },
          { date: "2023-05-02", value: 150 },
          { date: "2023-05-03", value: 200 },
          { date: "2023-05-04", value: 180 },
          { date: "2023-05-05", value: 220 },
          { date: "2023-05-06", value: 250 },
          { date: "2023-05-07", value: 300 },
        ],
        engagement: [
          { date: "2023-05-01", value: 10 },
          { date: "2023-05-02", value: 15 },
          { date: "2023-05-03", value: 20 },
          { date: "2023-05-04", value: 18 },
          { date: "2023-05-05", value: 22 },
          { date: "2023-05-06", value: 25 },
          { date: "2023-05-07", value: 30 },
        ],
        revenue: [
          { date: "2023-05-01", value: 50 },
          { date: "2023-05-02", value: 75 },
          { date: "2023-05-03", value: 100 },
          { date: "2023-05-04", value: 90 },
          { date: "2023-05-05", value: 110 },
          { date: "2023-05-06", value: 125 },
          { date: "2023-05-07", value: 150 },
        ],
      });
    };

    fetchAnalyticsData();
  }, [contentId, dateRange]);

  if (!analyticsData) {
    return <div>Loading analytics data...</div>;
  }

  return (
    <Tabs defaultValue="views" className="space-y-4">
      <div className="flex justify-between items-center">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-40 bg-zinc-700 text-zinc-100">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {Object.entries(analyticsData).map(([key, data]) => (
        <TabsContent key={key} value={key}>
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle className="capitalize">{key} Over Time</CardTitle>
              <CardDescription>
                Trend of {key} for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data as any[]}>
                  <XAxis dataKey="date" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    contentStyle={{ background: "#27272a", border: "none" }}
                    labelStyle={{ color: "#f1f5f9" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#f1f5f9"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
