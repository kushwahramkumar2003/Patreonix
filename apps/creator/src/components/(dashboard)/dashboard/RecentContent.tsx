"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { FileText, Eye, ThumbsUp, MessageSquare } from "lucide-react";

interface ContentItem {
  title: string;
  type: string;
  views: number;
  likes: number;
  comments: number;
  date: string;
}

interface RecentContentProps {
  items: ContentItem[];
}

export function RecentContent({ items }: RecentContentProps) {
  return (
    <Card className="bg-zinc-800 border-zinc-700">
      <CardHeader>
        <CardTitle className="text-zinc-100">Recent Content</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-4 bg-zinc-700/50 p-3 rounded-lg"
            >
              <div className="bg-zinc-600 p-2 rounded-full">
                <FileText className="w-4 h-4 text-zinc-200" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-zinc-100">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-400">
                  {item.type} • {item.date}
                </p>
              </div>
              <div className="flex space-x-2 text-xs text-zinc-400">
                <span className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" /> {item.views}
                </span>
                <span className="flex items-center">
                  <ThumbsUp className="w-3 h-3 mr-1" /> {item.likes}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" /> {item.comments}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
