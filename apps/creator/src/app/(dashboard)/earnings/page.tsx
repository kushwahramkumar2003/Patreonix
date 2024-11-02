"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { toast } from "sonner";
import { EarningsOverview } from "../../../components/(dashboard)/earnings/EarningsOverview";
import { EarningsChart } from "../../../components/(dashboard)/earnings/EarningsChart";
import { Label } from "@repo/ui/components/ui/Label";
import { Input } from "@repo/ui/components/ui/Input";
import { TransactionHistory } from "../../../components/(dashboard)/earnings/TransactionHistory";
import Button from "@repo/ui/components/ui/Button";

// Dummy data
const earningsData = [
  { date: "Jan", amount: 500 },
  { date: "Feb", amount: 750 },
  { date: "Mar", amount: 1000 },
  { date: "Apr", amount: 1250 },
  { date: "May", amount: 1500 },
  { date: "Jun", amount: 1750 },
];

const transactions = [
  {
    id: "1",
    date: "2023-06-01",
    amount: 100,
    type: "Subscription" as const,
    status: "Completed" as const,
  },
  {
    id: "2",
    date: "2023-06-02",
    amount: 50,
    type: "Tip" as const,
    status: "Completed" as const,
  },
  {
    id: "3",
    date: "2023-06-03",
    amount: 200,
    type: "Withdrawal" as const,
    status: "Pending" as const,
  },
  {
    id: "4",
    date: "2023-06-04",
    amount: 75,
    type: "Subscription" as const,
    status: "Failed" as const,
  },
  {
    id: "5",
    date: "2023-06-05",
    amount: 150,
    type: "Tip" as const,
    status: "Completed" as const,
  },
];

export default function EarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    // Implement withdrawal logic here
    toast.success(`Withdrawal of $${withdrawAmount} initiated`);
    setWithdrawAmount("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold text-zinc-100">Earnings</h1>

      <EarningsOverview
        totalEarnings={5000}
        pendingRewards={250}
        earningsChange={15}
      />

      <div className="grid gap-8 md:grid-cols-2">
        <EarningsChart data={earningsData} />

        <Card className="bg-zinc-800 border-zinc-700">
          <CardHeader>
            <CardTitle className="text-zinc-100">Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-zinc-300">
                  Amount
                </Label>
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-zinc-700 text-zinc-100 border-zinc-600"
                />
              </div>
              <Button onClick={handleWithdraw} className="w-full">
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionHistory transactions={transactions} />
    </motion.div>
  );
}
