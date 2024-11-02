"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@repo/ui/components/ui/Button";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Icons } from "../../ui/icons";

//@ts-ignore
export function ContentDetails({ content }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.content);

  const handleSave = () => {
    // Here you would typically make an API call to save the changes
    console.log("Saving changes:", editedContent);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Content</h2>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Icons.edit className="mr-2 h-4 w-4" /> Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[200px] bg-zinc-700 text-zinc-100"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="whitespace-pre-wrap">{content.content}</p>
        </motion.div>
      )}
    </div>
  );
}
