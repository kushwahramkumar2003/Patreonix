"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import Button from "@repo/ui/components/ui/Button";
import { Badge } from "@repo/ui/components/ui/badge";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Icons } from "../../ui/icons";

type ContentItem = {
  id: string;
  title: string;
  type: "post" | "video" | "audio";
  status: "published" | "draft" | "scheduled";
  date: string;
  views: number;
  likes: number;
};

type ContentListProps = {
  category: string;
  searchQuery: string;
};

export function ContentList({ category, searchQuery }: ContentListProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    // Simulated API call to fetch content
    const fetchContent = async () => {
      // In a real application, you would fetch data from your API here
      const mockContent: ContentItem[] = [
        {
          id: "1",
          title: "Getting Started with Patreonix",
          type: "post",
          status: "published",
          date: "2023-05-01",
          views: 1200,
          likes: 89,
        },
        {
          id: "2",
          title: "Monthly Update Video",
          type: "video",
          status: "scheduled",
          date: "2023-05-15",
          views: 0,
          likes: 0,
        },
        {
          id: "3",
          title: "Exclusive Podcast Episode",
          type: "audio",
          status: "draft",
          date: "2023-05-10",
          views: 0,
          likes: 0,
        },
        // Add more mock content items here
      ];

      setContent(mockContent);
    };

    fetchContent();
  }, []);

  const filteredContent = content.filter((item) => {
    const matchesCategory = category === "all" || item.type === category;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk actions (delete, publish, etc.)
    console.log(`Bulk action: ${action} for items:`, selectedItems);
  };

  return (
    <div>
      {selectedItems.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <span>{selectedItems.length} items selected</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Bulk Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 text-zinc-100">
              <DropdownMenuItem onClick={() => handleBulkAction("publish")}>
                Publish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("unpublish")}>
                Unpublish
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("delete")}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedItems.length === filteredContent.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedItems(filteredContent.map((item) => item.id));
                  } else {
                    setSelectedItems([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Likes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContent.map((item) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableCell>
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={() => toggleItemSelection(item.id)}
                />
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.type === "post"
                      ? "default"
                      : item.type === "video"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {item.type}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "published"
                      ? "success"
                      : item.status === "draft"
                        ? "warning"
                        : "info"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.views}</TableCell>
              <TableCell>{item.likes}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Icons.moreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-zinc-800 text-zinc-100"
                  >
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>View</DropdownMenuItem>
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
