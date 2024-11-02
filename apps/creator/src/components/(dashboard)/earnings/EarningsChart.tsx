"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsChartProps {
  data: { date: string; amount: number }[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-zinc-100">Earnings Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
                itemStyle={{ color: "#E5E7EB" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
