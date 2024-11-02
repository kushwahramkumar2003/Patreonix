"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";

import { Input } from "@repo/ui/components/ui/Input";
import { Label } from "@repo/ui/components/ui/Label";
import { Icons } from "@/components/ui/icons";

export function BillingSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulated API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(cardDetails);
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your payment methods and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              value={cardDetails.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="bg-zinc-700 text-zinc-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                value={cardDetails.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="bg-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleInputChange}
                placeholder="123"
                className="bg-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <Button variant="outline" className="w-full">
            <Icons.plus className="mr-2 h-4 w-4" />
            Add New Payment Method
          </Button>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Billing Information
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
