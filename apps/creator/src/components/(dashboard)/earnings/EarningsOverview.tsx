"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface EarningsOverviewProps {
  totalEarnings: number;
  pendingRewards: number;
  earningsChange: number;
}

export function EarningsOverview({
  totalEarnings,
  pendingRewards,
  earningsChange,
}: EarningsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Pending Rewards
            </CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">
              ${pendingRewards.toFixed(2)}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">
              Earnings Change
            </CardTitle>
            {earningsChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">
              {earningsChange >= 0 ? "+" : "-"}
              {Math.abs(earningsChange).toFixed(2)}%
            </div>
            <p className="text-xs text-zinc-400 mt-1">Compared to last month</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
