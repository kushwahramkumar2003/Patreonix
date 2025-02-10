"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@repo/ui/components/ui/Button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Icons } from "../../ui/icons";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { format } from "date-fns";
import { Input } from "@repo/ui/components/ui/Input";
import { PublicKey } from "@solana/web3.js";

interface ContentData {
  index: number;
  pda: string;
  creator: PublicKey;
  title: string;
  description: string;
  contentUrl: string;
  contentType: "text" | "image" | "video" | "audio";
  createdAt: string;
  updatedAt: string | null;
  likes: number;
  views: number;
  isActive: boolean;
}

interface ContentDetailsProps {
  content: ContentData;
  onUpdate?: (updatedContent: Partial<ContentData>) => Promise<void>;
}

const contentTypeIcons = {
  text: Icons.fileText,
  image: Icons.image,
  video: Icons.video,
  audio: Icons.audio,
} as const;

export function ContentDetails({ content, onUpdate }: ContentDetailsProps) {
  debugger;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState({
    title: content.title,
    description: content.description,
    contentUrl: content.contentUrl,
  });

  const ContentTypeIcon = contentTypeIcons[content.contentType];

  const handleInputChange = (
    field: keyof typeof editedContent,
    value: string
  ) => {
    setEditedContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  debugger;
  const formatDate = (timestamp: string) => {
    try {
      // Handle Unix timestamp (seconds)
      const date = new Date(parseInt(timestamp) * 1000);
      return format(date, "PPP");
    } catch (err) {
      // Handle ISO string or other date formats
      try {
        return format(new Date(timestamp), "PPP");
      } catch {
        return "Invalid date";
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!editedContent.title.trim()) {
        throw new Error("Title cannot be empty");
      }

      if (!editedContent.contentUrl.trim()) {
        throw new Error("Content URL cannot be empty");
      }

      if (onUpdate) {
        await onUpdate(editedContent);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContentPreview = () => {
    switch (content.contentType) {
      case "image":
        return (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={content.contentUrl}
              alt={content.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.jpg";
              }}
            />
          </div>
        );
      case "video":
        return (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
            <video
              controls
              className="w-full h-full"
              src={content.contentUrl}
              poster="/video-placeholder.jpg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "audio":
        return (
          <div className="w-full p-4 bg-zinc-800 rounded-lg">
            <audio controls className="w-full" src={content.contentUrl}>
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      case "text":
      default:
        return (
          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-wrap">
              {typeof content.description === "string"
                ? content.description
                : "No description available"}
            </p>
          </div>
        );
    }
  };

  return (
    <Card className="bg-zinc-900 text-zinc-100">
      <CardContent className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <ContentTypeIcon className="h-6 w-6 text-zinc-100" />
            </div>
            <h2 className="text-2xl font-semibold">
              {isEditing ? "Edit Content" : content.title}
            </h2>
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Icons.edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-900 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editedContent.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-zinc-800"
                placeholder="Enter title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editedContent.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="min-h-[200px] bg-zinc-800"
                placeholder="Enter description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Content URL</label>
              <Input
                value={editedContent.contentUrl}
                onChange={(e) =>
                  handleInputChange("contentUrl", e.target.value)
                }
                className="bg-zinc-800"
                placeholder="Enter content URL"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  setEditedContent({
                    title: content.title,
                    description: content.description,
                    contentUrl: content.contentUrl,
                  });
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              {renderContentPreview()}

              <div className="flex items-center justify-between text-sm text-zinc-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Icons.eye className="mr-1 h-4 w-4" />
                    {typeof content.views === "number"
                      ? content.views.toLocaleString()
                      : "0"}{" "}
                    views
                  </span>
                  <span className="flex items-center">
                    <Icons.heart className="mr-1 h-4 w-4" />
                    {typeof content.likes === "number"
                      ? content.likes.toLocaleString()
                      : "0"}{" "}
                    likes
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span>Created: {formatDate(content.createdAt)}</span>
                  {content.updatedAt && (
                    <span>• Updated: {formatDate(content.updatedAt)}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-zinc-400">
              <Icons.user className="h-4 w-4" />
              <span>Creator: {content.creator.toBase58()}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
