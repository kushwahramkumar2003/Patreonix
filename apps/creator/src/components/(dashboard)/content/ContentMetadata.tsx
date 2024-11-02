"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@repo/ui/components/ui/Button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { Switch } from "@repo/ui/components/ui/switch";
import { Label } from "@repo/ui/components/ui/Label";
import { Input } from "@repo/ui/components/ui/Input";
import { Icons } from "../../ui/icons";

export function ContentMetadata({ content }) {
  const [metadata, setMetadata] = useState({
    title: content.title,
    status: content.status,
    visibility: "public",
    allowComments: true,
    tags: content.tags || [],
  });

  const handleChange = (field, value) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving metadata:", metadata);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={metadata.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="bg-zinc-700 text-zinc-100"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label htmlFor="status">Status</Label>
        <Select
          value={metadata.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger id="status" className="bg-zinc-700 text-zinc-100">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Label htmlFor="visibility">Visibility</Label>
        <Select
          value={metadata.visibility}
          onValueChange={(value) => handleChange("visibility", value)}
        >
          <SelectTrigger id="visibility" className="bg-zinc-700 text-zinc-100">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 text-zinc-100">
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="patrons-only">Patrons Only</SelectItem>
            <SelectItem value="specific-tiers">Specific Tiers</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center space-x-2"
      >
        <Switch
          id="comments"
          checked={metadata.allowComments}
          onCheckedChange={(checked) => handleChange("allowComments", checked)}
        />
        <Label htmlFor="comments">Allow Comments</Label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={metadata.tags.join(", ")}
          onChange={(e) => handleChange("tags", e.target.value.split(", "))}
          placeholder="Enter tags separated by commas"
          className="bg-zinc-700 text-zinc-100"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button onClick={handleSave}>
          <Icons.save className="mr-2 h-4 w-4" /> Save Metadata
        </Button>
      </motion.div>
    </div>
  );
}
