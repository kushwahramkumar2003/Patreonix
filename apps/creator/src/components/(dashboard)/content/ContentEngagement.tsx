"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { ContentComments } from "./ContentComments";
import { Icons } from "../../ui/icons";

export function ContentEngagement({ content }) {
  const [engagementData, setEngagementData] = useState(null);

  useEffect(() => {
    // Simulated API call to fetch engagement data
    const fetchEngagementData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEngagementData({
        likes: 1234,
        comments: 56,
        shares: 78,
        bookmarks: 90,
      });
    };

    fetchEngagementData();
  }, [content.id]);

  if (!engagementData) {
    return <div>Loading engagement data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(engagementData).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-zinc-700 text-zinc-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {key}
                </CardTitle>
                {key === "likes" && (
                  <Icons.heart className="h-4 w-4 text-red-400" />
                )}
                {key === "comments" && (
                  <Icons.messageCircle className="h-4 w-4 text-blue-400" />
                )}
                {key === "shares" && (
                  <Icons.share className="h-4 w-4 text-green-400" />
                )}
                {key === "bookmarks" && (
                  <Icons.bookmark className="h-4 w-4 text-yellow-400" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
          <CardDescription>Latest comments on this content</CardDescription>
        </CardHeader>
        <CardContent>
          <ContentComments contentId={content.id} limit={5} />
        </CardContent>
      </Card>
    </div>
  );
}
