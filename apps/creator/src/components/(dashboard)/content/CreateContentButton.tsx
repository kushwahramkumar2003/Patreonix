"use client";

import { useState } from "react";
import Button from "@repo/ui/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import { Icons } from "../../ui/icons";
import { CreatePostForm } from "../create/CreatePostForm";
import { CreatePollForm } from "../create/CreatePollForm";
import { CreateTierForm } from "../create/CreateTierForm";
import { CreateGoalForm } from "../create/CreateGoalForm";

export function CreateContentButton() {
  const [contentType, setContentType] = useState<string | null>(null);

  const renderForm = () => {
    switch (contentType) {
      case "post":
        return <CreatePostForm />;
      case "poll":
        return <CreatePollForm />;
      case "tier":
        return <CreateTierForm />;
      case "goal":
        return <CreateGoalForm />;
      default:
        return null;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Icons.plus className="mr-2 h-4 w-4" /> Create Content
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
          <DialogDescription>
            Choose the type of content you want to create
          </DialogDescription>
        </DialogHeader>
        {!contentType ? (
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={() => setContentType("post")}>
              <Icons.fileText className="mr-2 h-4 w-4" /> Post
            </Button>
            <Button onClick={() => setContentType("poll")}>
              <Icons.barChart className="mr-2 h-4 w-4" /> Poll
            </Button>
            <Button onClick={() => setContentType("tier")}>
              <Icons.layers className="mr-2 h-4 w-4" /> Tier
            </Button>
            <Button onClick={() => setContentType("goal")}>
              <Icons.target className="mr-2 h-4 w-4" /> Goal
            </Button>
          </div>
        ) : (
          renderForm()
        )}
      </DialogContent>
    </Dialog>
  );
}
