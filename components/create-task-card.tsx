"use client";

import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

type Props = {
  onClick: () => void;
};

export default function CreateTaskCard({ onClick }: Props) {
  return (
    <Card
      role="button"
      onClick={onClick}
      className="
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        gap-2
        rounded-xl
        border-2
        border-dashed
        border-muted
        bg-background
        p-5
        text-muted-foreground
        transition-all
        duration-200
        hover:border-primary/40
        hover:bg-muted/30
        hover:text-foreground
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Plus className="h-5 w-5" />
      </div>

      <p className="font-medium">Create New Task</p>
      <p className="text-xs text-muted-foreground">
        Add a new item to your list
      </p>
    </Card>
  );
}
