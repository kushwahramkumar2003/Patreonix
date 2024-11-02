"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import Button from "@repo/ui/components/ui/Button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { ContentDetails } from "@/components/(dashboard)/content/ContentDetails";
import { ContentMetadata } from "@/components/(dashboard)/content/ContentMetadata";
import { ContentEngagement } from "@/components/(dashboard)/content/ContentEngagement";
import { ContentAnalytics } from "@/components/(dashboard)/content/ContentAnalytics";

export default function ContentDetailPage() {
  const params = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setContent({
        //@ts-ignore
        id: params.id,
        title: "Sample Content Title",
        type: "post",
        status: "published",
        createdAt: "2023-05-15",
        updatedAt: "2023-05-16",
        content: "This is the content of the post...",
        // Add more fields as needed
      });
      setLoading(false);
    };

    fetchContent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          //@ts-ignore
          <h1 className="text-3xl font-bold">
            {
              //@ts-ignore
              content?.title
            }
          </h1>
          <Button variant="outline">
            <Icons.edit className="mr-2 h-4 w-4" /> Edit Content
          </Button>
        </div>
        <div className="flex space-x-2 mb-4">
          <Badge variant="secondary">
            {
              //@ts-ignore
              content.type
            }
          </Badge>
          <Badge variant="outline">
            {
              //@ts-ignore
              content.status
            }
          </Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList className="bg-zinc-800">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Details</CardTitle>
              <CardDescription>View and edit your content</CardDescription>
            </CardHeader>
            <CardContent>
              <ContentDetails content={content} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="metadata">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Metadata</CardTitle>
              <CardDescription>
                Manage content metadata and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentMetadata content={content} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Engagement</CardTitle>
              <CardDescription>
                View likes, comments, and shares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentEngagement content={content} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card className="bg-zinc-800 text-zinc-100">
            <CardHeader>
              <CardTitle>Content Analytics</CardTitle>
              <CardDescription>
                Detailed performance metrics for this content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentAnalytics
                contentId={
                  //@ts-ignore
                  content.id
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
