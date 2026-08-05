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
        min-h-36
        md:min-h-40
        group
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        gap-2
        rounded-lg
        border-dashed
        border-border
        p-5
        text-muted-foreground
        transition-colors
        duration-200
        hover:border-primary/40
        hover:bg-primary/5
        hover:text-foreground
      "
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
        <Plus className="h-5 w-5" />
      </div>

      <p className="font-semibold text-foreground">Create new task</p>
      <p className="text-xs text-muted-foreground">
        Add a new item to your list
      </p>
    </Card>
  );
}
