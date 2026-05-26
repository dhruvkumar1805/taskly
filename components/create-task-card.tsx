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
        min-h-48
        group
        flex
        cursor-pointer
        flex-col
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-dashed
        border-teal-500/25
        bg-card/70
        p-5
        text-muted-foreground
        shadow-sm
        backdrop-blur-xl
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-teal-500/45
        hover:bg-teal-500/5
        hover:shadow-md
        hover:text-foreground
      "
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500/10 text-teal-700 transition group-hover:bg-teal-500/15 dark:text-teal-300">
        <Plus className="h-5 w-5" />
      </div>

      <p className="font-semibold text-foreground">Create New Task</p>
      <p className="text-xs text-muted-foreground">
        Add a new item to your list
      </p>
    </Card>
  );
}
