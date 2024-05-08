"use client";

import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LucideIcon, MoreHorizontal, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";

interface FlowsheetProps {
  id?: Id<"courseFlowsheets">;
  active?: boolean;
  label: string;
  onClick?: () => void;
  icon: LucideIcon;
}

export const Flowsheet = ({
  id,
  label,
  onClick,
  active,
  icon: Icon,
}: FlowsheetProps) => {
  const { user } = useUser();
  const router = useRouter();
  const archive = useMutation(api.courseFlowsheets.archive);

  const onArchive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() =>
      router.push("/course-flowsheets")
    );

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Course flowsheet moved to trash.",
      error: "Failed to archive course flowsheet.",
    });
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{
        paddingLeft: "12px",
      }}
      className={cn(
        "group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <>
          <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
          <span className="truncate">{label}</span>
        </>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div
                role="button"
                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

Flowsheet.Skeleton = function ItemSkeleton() {
  return (
    <div className="flex gap-x-2 py-[3px]">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};
