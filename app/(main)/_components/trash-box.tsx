"use client";

import { useMutation, useQuery } from "convex/react";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useState } from "react";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const courseFlowsheets = useQuery(api.courseFlowsheets.getTrash);
  const restoreCourseFlowsheet = useMutation(api.courseFlowsheets.restore);
  const removeCourseFlowsheet = useMutation(api.courseFlowsheets.remove);

  const [search, setSearch] = useState("");

  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const filteredCourseFlowsheets = courseFlowsheets?.filter(
    (courseFlowsheet) => {
      return courseFlowsheet.program
        .toLowerCase()
        .includes(search.toLowerCase());
    }
  );

  const onClickNote = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onClickCourseFlowsheet = (courseFlowsheetId: string) => {
    router.push(`/course-flowsheets/${courseFlowsheetId}`);
  };

  const onRestoreNote = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });

    toast.promise(promise, {
      loading: "Restoring note",
      success: "Note restored.",
      error: "Failed to restore note.",
    });
  };

  const onRestoreCourseFlowsheet = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    courseFlowsheetId: Id<"courseFlowsheets">
  ) => {
    event.stopPropagation();
    const promise = restoreCourseFlowsheet({ id: courseFlowsheetId });

    toast.promise(promise, {
      loading: "Restoring course flowsheet",
      success: "Course flowsheet restored.",
      error: "Failed to restore course flowsheet.",
    });
  };

  const onRemoveNote = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });

    toast.promise(promise, {
      loading: "Deleting note",
      success: "Note deleted.",
      error: "Failed to delete note.",
    });

    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const onRemoveCourseFlowsheet = (
    courseFlowsheetId: Id<"courseFlowsheets">
  ) => {
    const promise = removeCourseFlowsheet({ id: courseFlowsheetId });

    toast.promise(promise, {
      loading: "Deleting course flowsheet",
      success: "Course flowsheet deleted.",
      error: "Failed to delete course flowsheet.",
    });

    if (params.courseFlowsheetId === courseFlowsheetId) {
      router.push("/course-flowsheets");
    }
  };

  if (documents === undefined || courseFlowsheets === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          Trash is empty.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClickNote(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => onRestoreNote(e, document._id)}
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemoveNote(document._id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
        {filteredCourseFlowsheets?.map((courseFlowsheet) => (
          <div
            key={courseFlowsheet._id}
            role="button"
            onClick={() => onClickCourseFlowsheet(courseFlowsheet._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2">{courseFlowsheet.program}</span>
            <div className="flex items-center">
              <div
                onClick={(e) =>
                  onRestoreCourseFlowsheet(e, courseFlowsheet._id)
                }
                role="button"
                className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
              >
                <Undo className="h-4 w-4 text-muted-foreground" />
              </div>
              <ConfirmModal
                onConfirm={() => onRemoveCourseFlowsheet(courseFlowsheet._id)}
              >
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
