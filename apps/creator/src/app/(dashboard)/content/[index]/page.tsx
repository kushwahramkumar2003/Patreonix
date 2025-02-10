"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProgram } from "@/hooks/usePatreonix";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Badge } from "@repo/ui/components/ui/badge";
import Button from "@repo/ui/components/ui/Button";
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
import { ContentDetails } from "@/components/(dashboard)/content/ContentDetails";
import { ContentMetadata } from "@/components/(dashboard)/content/ContentMetadata";
import { ContentEngagement } from "@/components/(dashboard)/content/ContentEngagement";
import { ContentAnalytics } from "@/components/(dashboard)/content/ContentAnalytics";
import { getFile } from "@/lib/ipfs";

// Types
interface ContentData {
  index: number;
  pda: string;
  creator: string;
  title: string;
  description: string;
  contentUrl: string;
  contentType: "text" | "image" | "video" | "audio";
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
  isActive: boolean;
}

interface InitializationStatus {
  isWalletReady: boolean;
  isProgramReady: boolean;
  hasAttemptedLoad: boolean;
}

const contentTypeIcons = {
  text: Icons.fileText,
  image: Icons.image,
  video: Icons.video,
  audio: Icons.audio,
} as const;

const ContentPreview = React.memo(({ content }: { content: ContentData }) => {
  const { contentType, contentUrl } = content;

  const handleMediaError = useCallback((type: string) => {
    toast.error(`Failed to load ${type}`);
  }, []);

  switch (contentType) {
    case "image":
      return (
        <div className="rounded-lg overflow-hidden max-h-[400px] flex justify-center items-center bg-zinc-900">
          <img
            src={contentUrl}
            alt={content.title}
            className="object-contain max-w-full max-h-[400px]"
            onError={() => handleMediaError("image")}
          />
        </div>
      );
    case "video":
      return (
        <div className="rounded-lg overflow-hidden">
          <video
            controls
            className="w-full max-h-[400px]"
            onError={() => handleMediaError("video")}
          >
            <source src={contentUrl} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    case "audio":
      return (
        <div className="rounded-lg bg-zinc-900 p-4">
          <audio
            controls
            className="w-full"
            onError={() => handleMediaError("audio")}
          >
            <source src={contentUrl} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    case "text":
      return (
        <div className="rounded-lg bg-zinc-900 p-4 max-h-[400px] overflow-y-auto">
          <p className="whitespace-pre-wrap">{content.description}</p>
        </div>
      );
    default:
      return null;
  }
});

ContentPreview.displayName = "ContentPreview";

const LoadingState = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-8 w-[200px]" />
      <Skeleton className="h-4 w-[100px]" />
    </div>
    <Skeleton className="h-[400px] w-full" />
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <Icons.alertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

const InitializationError = ({ status }: { status: InitializationStatus }) => {
  const getMessage = () => {
    if (!status.isWalletReady)
      return "Please connect your wallet to view content";
    if (!status.isProgramReady) return "Program initialization is pending";
    return "Unable to load content. Please try again";
  };

  return <ErrorState message={getMessage()} />;
};

export default function ContentDetailPage({
  params,
}: {
  params: {
    index: string;
  };
}) {
  const router = useRouter();
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { program } = useProgram();
  const { publicKey } = useWallet();
  const [initStatus, setInitStatus] = useState<InitializationStatus>({
    isWalletReady: false,
    isProgramReady: false,
    hasAttemptedLoad: false,
  });

  // Memoize initialization check
  const checkInitialization = useCallback(() => {
    setInitStatus((prev) => ({
      isWalletReady: !!publicKey,
      isProgramReady: !!program,
      hasAttemptedLoad: true,
    }));
  }, [publicKey, program]);

  // Memoize content fetching logic
  const fetchContent = useCallback(async () => {
    if (!program || !publicKey || !params.index) {
      return;
    }

    try {
      const contentData = await program.getContentByIndex(
        publicKey,
        Number(params.index)
      );

      console.log("Content data:", contentData);

      if (!contentData) {
        setError("Content not found");
        return;
      }
      const contentUrl = `https://gateway.pinata.cloud/ipfs/${contentData.contentUrl}`;

      setContent({
        ...contentData,
        contentUrl,
        contentType: contentData.contentType as
          | "text"
          | "image"
          | "video"
          | "audio",
        pda: contentData.pda.toBase58(),
      });
    } catch (err) {
      console.error("Error fetching content:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }, [program, publicKey, params.index]);

  // Effect for initialization check
  useEffect(() => {
    checkInitialization();
  }, [checkInitialization]);

  // Effect for content fetching
  useEffect(() => {
    if (initStatus.isWalletReady && initStatus.isProgramReady) {
      fetchContent();
    } else if (initStatus.hasAttemptedLoad) {
      setLoading(false);
    }
  }, [initStatus, fetchContent]);

  const handleEdit = useCallback(() => {
    router.push(`/content/${params.index}/edit`);
  }, [router, params.index]);

  const handleShare = useCallback(() => {
    // Implement share functionality
    toast.info("Share functionality coming soon");
  }, []);

  if (loading) return <LoadingState />;
  if (!initStatus.isWalletReady || !initStatus.isProgramReady) {
    return <InitializationError status={initStatus} />;
  }
  if (error) return <ErrorState message={error} />;
  if (!content) return <ErrorState message="Content not found" />;

  const ContentTypeIcon = contentTypeIcons[content.contentType];

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-start">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{content.title}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <ContentTypeIcon className="h-4 w-4" />
                {content.contentType}
              </Badge>
              <Badge variant="outline">
                {content.isActive ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{`${content.views} views`}</Badge>
              <Badge variant="outline">{`${content.likes} likes`}</Badge>
            </div>
            <p className="text-sm text-zinc-400">
              Created{" "}
              {format(new Date(parseInt(content.createdAt) * 1000), "PPP")}
              {content.updatedAt &&
                ` • Updated ${format(new Date(parseInt(content.updatedAt)*1000), "PPP")}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Icons.edit className="mr-2 h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Icons.share className="mr-2 h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <ContentPreview content={content} />

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList className="bg-zinc-800">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="metadata">Metadata</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="details">
              <Card className="bg-zinc-800 text-zinc-100">
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                  <CardDescription>
                    View and manage your content details
                  </CardDescription>
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
                    Technical details and settings
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
                  <CardDescription>Track user interactions</CardDescription>
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
                    Performance metrics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentAnalytics contentId={content.pda} />
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}
