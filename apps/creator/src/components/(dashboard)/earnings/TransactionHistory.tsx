"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import { Badge } from "@repo/ui/components/ui/badge";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: "Subscription" | "Tip" | "Withdrawal";
  status: "Completed" | "Pending" | "Failed";
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const getStatusStyles = (status: Transaction["status"]) => {
  const styles = {
    Completed: {
      background: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-600/50",
      icon: "●",
    },
    Pending: {
      background: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-600/50",
      icon: "○",
    },
    Failed: {
      background: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-600/50",
      icon: "×",
    },
  };
  return styles[status];
};

const getTypeStyles = (type: Transaction["type"]) => {
  const styles = {
    Subscription: "text-blue-400",
    Tip: "text-purple-400",
    Withdrawal: "text-orange-400",
  };
  return styles[type];
};

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-zinc-100 flex items-center gap-2">
          Transaction History
          <span className="text-sm font-normal text-zinc-400">
            ({transactions.length} transactions)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700/50">
              <TableHead className="text-zinc-400 font-medium">Date</TableHead>
              <TableHead className="text-zinc-400 font-medium">Type</TableHead>
              <TableHead className="text-zinc-400 font-medium">
                Amount
              </TableHead>
              <TableHead className="text-zinc-400 font-medium">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => {
              const statusStyle = getStatusStyles(transaction.status);
              const typeStyle = getTypeStyles(transaction.type);

              return (
                <TableRow
                  key={transaction.id}
                  className="border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
                >
                  <TableCell className="font-medium text-zinc-300">
                    {transaction.date}
                  </TableCell>
                  <TableCell className={`${typeStyle} font-medium`}>
                    {transaction.type}
                  </TableCell>
                  <TableCell className="text-zinc-300 font-medium">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`
                        ${statusStyle.background}
                        ${statusStyle.text}
                        ${statusStyle.border}
                        border
                        font-medium
                        backdrop-blur-md
                        flex
                        items-center
                        gap-1.5
                        w-28
                      `}
                    >
                      <span className="text-xs">{statusStyle.icon}</span>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
