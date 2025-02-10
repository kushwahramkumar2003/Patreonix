"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useProgram } from "@/hooks/usePatreonix";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { useRouter } from "next/navigation";

// Define the ContentItem type with all required properties
type ContentItem = {
  index: number;
  pda: anchor.web3.PublicKey;
  creator: anchor.web3.PublicKey;
  title: string;
  description: string;
  contentUrl: string;
  contentType: "text" | "image" | "video" | "audio";
  createdAt: string;
  isActive: boolean;
  // Optional properties that might not be in the blockchain but useful for UI
  views?: number;
  likes?: number;
};

type ContentListProps = {
  category: string;
  searchQuery: string;
};

export function ContentList({ category, searchQuery }: ContentListProps) {
  // State management
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Using index as identifier
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const router = useRouter();

  // Hooks
  const { program } = useProgram();
  const { publicKey } = useWallet();

  const validateContentItem = useCallback(
    (item: any) => ({
      ...item,
      contentType: item.contentType ?? "text",
    }),
    []
  );

  // Memoize the content update function
  const updateContent = useCallback(
    (
      prevContent: ContentItem[],
      newItems: ContentItem[],
      currentPage: number
    ) => {
      return currentPage === 0 ? newItems : [...prevContent, ...newItems];
    },
    []
  );

  // Memoize the fetch content function
  const fetchContent = useCallback(async () => {
    if (!publicKey || !program) {
      setIsLoading(false);
      setError("Please connect your wallet");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      console.log("Fetching content for page:", page);
      const paginatedContent = await program.getPaginatedContent(
        publicKey,
        page,
        pageSize
      );

      // Transform the items using our memoized validation function
      const validatedItems = paginatedContent.items.map(validateContentItem);

      // Update content using our memoized update function
      setContent((prevContent) =>
        updateContent(prevContent, validatedItems, page)
      );

      setHasMore(paginatedContent.hasMore);
    } catch (err) {
      setError("Failed to fetch content. Please try again later.");
      console.error("Error fetching content:", err);
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, program, page, pageSize, validateContentItem, updateContent]);

  // Memoize dependencies for the effect
  const effectDependencies = useMemo(
    () => ({
      shouldFetch: Boolean(publicKey && program),
      currentPage: page,
    }),
    [publicKey, program, page]
  );

  // Use effect with memoized dependencies
  useEffect(() => {
    if (effectDependencies.shouldFetch) {
      fetchContent();
    }
  }, [fetchContent, effectDependencies]);

  // Filter content based on category and search query
  const filteredContent = content.filter((item) => {
    const matchesCategory =
      category === "all" ||
      item.contentType.toLowerCase() === category.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Selection handlers
  const toggleItemSelection = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? filteredContent.map((item) => item.index) : []);
  };

  // Bulk actions handler
  const handleBulkAction = async (
    action: "delete" | "deactivate" | "activate"
  ) => {
    if (!program || !publicKey) return;

    try {
      const selectedContent = content.filter((item) =>
        selectedItems.includes(item.index)
      );

      // Example bulk action implementation
      switch (action) {
        case "delete":
          // Implement delete functionality
          break;
        case "deactivate":
          // Implement deactivate functionality
          break;
        case "activate":
          // Implement activate functionality
          break;
      }

      // Reset selection after successful action
      setSelectedItems([]);

      // Refresh content
      setPage(0);
    } catch (err) {
      setError(`Failed to perform ${action} action. Please try again.`);
      console.error(`Error performing ${action}:`, err);
    }
  };

  // Render loading state
  if (isLoading && page === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Render empty state
  if (filteredContent.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No content found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk actions section */}
      {selectedItems.length > 0 && (
        <div className="flex justify-between items-center p-4 bg-zinc-800 rounded-lg">
          <span className="text-zinc-100">
            {selectedItems.length} items selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Bulk Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-800 text-zinc-100">
              <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                Activate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("deactivate")}>
                Deactivate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleBulkAction("delete")}
                className="text-red-400"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Content table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={
                  selectedItems.length === filteredContent.length &&
                  filteredContent.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {filteredContent.map((item) => (
              <motion.tr
                key={item.pda.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(item.index)}
                    onCheckedChange={() => toggleItemSelection(item.index)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-zinc-500">
                      {item.description.slice(0, 50)}...
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.contentType}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? "default" : "destructive"}>
                    {item.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(parseInt(item.createdAt)).toLocaleDateString()}
                </TableCell>
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
                      <DropdownMenuItem>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-zinc-700 hover:cursor-pointer"
                          onClick={() => router.push(`/content/${item.index}`)}
                        >
                          View Content
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-zinc-700 hover:cursor-pointer"
                        >
                          Edit Details
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400">
                        <Button size="sm" variant="ghost">
                          Delete
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>

      {/* Load more button */}
      {hasMore && (
        <div className="text-center py-4">
          <Button
            variant="outline"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.loader className="h-4 w-4 animate-spin" />
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
