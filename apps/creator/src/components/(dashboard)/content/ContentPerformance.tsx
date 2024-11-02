"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";

const performanceData = [
  { name: "Post 1", views: 4000, likes: 2400, comments: 400 },
  { name: "Video 1", views: 3000, likes: 1398, comments: 200 },
  { name: "Audio 1", views: 2000, likes: 9800, comments: 600 },
  { name: "Post 2", views: 2780, likes: 3908, comments: 300 },
  { name: "Video 2", views: 1890, likes: 4800, comments: 150 },
  { name: "Audio 2", views: 2390, likes: 3800, comments: 250 },
  { name: "Post 3", views: 3490, likes: 4300, comments: 350 },
];

export function ContentPerformance() {
  const [metric, setMetric] = useState("views");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Content Performance</h3>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-40 bg-zinc-700 text-zinc-100">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            <SelectItem value="views">Views</SelectItem>
            <SelectItem value="likes">Likes</SelectItem>
            <SelectItem value="comments">Comments</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={performanceData}>
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{ background: "#27272a", border: "none" }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Bar dataKey={metric} fill="#f1f5f9" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">19,550</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30,406</div>
            <p className="text-xs text-muted-foreground">
              +15.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800 text-zinc-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Comments
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,250</div>
            <p className="text-xs text-muted-foreground">
              +5.4% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
