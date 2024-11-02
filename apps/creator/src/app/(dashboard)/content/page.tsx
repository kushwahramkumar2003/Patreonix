"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { Input } from "@repo/ui/components/ui/Input";
import Button from "@repo/ui/components/ui/Button";
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
import { ContentList } from "@/components/(dashboard)/content/ContentList";
import { ContentPerformance } from "@/components/(dashboard)/content/ContentPerformance";
import { ContentComments } from "@/components/(dashboard)/content/ContentComments";
import { ContentAnalytics } from "@/components/(dashboard)/content/ContentAnalytics";
import { CreateContentButton } from "@/components/(dashboard)/content/CreateContentButton";

export default function ContentManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="text-start mb-8">
          <h1 className="text-4xl font-bold text-zinc-100 mb-2">
            Content Management
          </h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-zinc-700 text-zinc-100"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-40 bg-zinc-700 text-zinc-100">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-zinc-100">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="images">Images</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CreateContentButton />
        </div>
      </motion.div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="list">Content List</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content List</CardTitle>
              <CardDescription>
                Manage and organize your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentList
                category={selectedCategory}
                searchQuery={searchQuery}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                View the performance metrics of your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentPerformance />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Comments</CardTitle>
              <CardDescription>
                Manage and respond to comments on your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentComments />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Detailed analytics and insights for your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentAnalytics contentId={undefined} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
