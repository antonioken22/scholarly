"use client";

import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Title } from "./title";
import { Banner } from "./banner";
import { Menu } from "./menu";
import { Publish } from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const params = useParams();

  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });

  if (document === undefined) {
    return (
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <Title initialData={document} />
          {!document.isArchived && (
            <div className="md:fixed md:top-0 md:right-0 md:m-1 flex items-center gap-x-2">
              <Publish initialData={document} />
              <Menu documentId={document._id} />
            </div>
          )}
        </div>
      </nav>
      {document.isArchived && ((isMobile && isCollapsed) || !isMobile) && (
        <Banner documentId={document._id} />
      )}
    </>
  );
};
