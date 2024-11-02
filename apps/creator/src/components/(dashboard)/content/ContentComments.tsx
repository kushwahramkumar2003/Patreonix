"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/ui/avatar";
import Button from "@repo/ui/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/Input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Icons } from "../../ui/icons";

type Comment = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
};

const initialComments: Comment[] = [
  {
    id: "1",
    author: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Great content! I really enjoyed this post.",
    date: "2023-05-01",
    likes: 5,
    replies: [
      {
        id: "1-1",
        author: "Bob Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "I agree, it was very informative!",
        date: "2023-05-02",
        likes: 2,
        replies: [],
      },
    ],
  },
  {
    id: "2",
    author: "Charlie Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Could you elaborate more on the third point?",
    date: "2023-05-03",
    likes: 1,
    replies: [],
  },
];

export function ContentComments() {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        avatar: "/placeholder.svg?height=40&width=40",
        content: newComment,
        //@ts-ignore
        date: new Date().toISOString().split("T")[0],
        likes: 0,
        replies: [],
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleLike = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1 }
                  : reply
              ),
            }
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card className="bg-zinc-800 text-zinc-100">
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-zinc-700 text-zinc-100"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddComment}>Post Comment</Button>
        </CardFooter>
      </Card>
      <AnimatePresence>
        {comments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-zinc-800 text-zinc-100 mb-4">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {comment.author}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {comment.date}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{comment.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(comment.id)}
                >
                  <Icons.heart className="mr-2 h-4 w-4" />
                  {comment.likes} Likes
                </Button>
                <Button variant="ghost" size="sm">
                  <Icons.messageCircle className="mr-2 h-4 w-4" />
                  Reply
                </Button>
              </CardFooter>
              {comment.replies.length > 0 && (
                <CardContent className="pt-0">
                  <div className="pl-6 border-l-2 border-zinc-700 mt-4 space-y-4">
                    {comment.replies.map((reply) => (
                      <Card
                        key={reply.id}
                        className="bg-zinc-700 text-zinc-100"
                      >
                        <CardHeader>
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={reply.avatar}
                                alt={reply.author}
                              />
                              <AvatarFallback>{reply.author[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-sm font-medium">
                                {reply.author}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {reply.date}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p>{reply.content}</p>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(reply.id)}
                          >
                            <Icons.heart className="mr-2 h-4 w-4" />
                            {reply.likes} Likes
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
