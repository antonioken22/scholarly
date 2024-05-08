"use client";

import {
  ChevronsLeft,
  Home,
  MenuIcon,
  Notebook,
  PlusCircle,
  Search,
  Settings,
  Sheet,
  Trash,
} from "lucide-react";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { UserItem } from "./user-item";
import { api } from "@/convex/_generated/api";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Item } from "./_notes/item";
import { DocumentList } from "./_notes/documents-list";
import { TrashBox } from "./trash-box";
import { Navbar } from "./_notes/navbar";
import { FlowsheetList } from "./_courseFlowsheets/flowsheet-list";

export const Navigation = () => {
  const router = useRouter();
  const settings = useSettings();
  const search = useSearch();
  const params = useParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width:768px)");

  const createNote = useMutation(api.documents.create);
  const createCourseFlowsheet = useMutation(api.courseFlowsheets.create);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const returnHome = () => {
    router.push(`/`);
  };

  const returnDocuments = () => {
    router.push(`/documents`);
  };

  const returnCourseFlowsheets = () => {
    router.push(`/course-flowsheets`);
  };

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `${newWidth}px`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);

      sidebarRef.current.style.width = isMobile ? "100%" : "240px";
      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100%-240%)"
      );
      navbarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", "100%");
      navbarRef.current.style.setProperty("left", "0");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreateNote = () => {
    const promise = createNote({ title: "Untitled" }).then((documentId) =>
      router.push(`/documents/${documentId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new note...",
      success: "New note created.",
      error: "Failed to create a new note.",
    });
  };

  const handleCreateCourseFlowsheet = () => {
    const promise = createCourseFlowsheet({ title: "Program" }).then(
      (courseflowsheetId) =>
        router.push(`/course-flowsheets/${courseflowsheetId}`)
    );

    toast.promise(promise, {
      loading: "Creating a course flowsheet...",
      success: "New course flowsheet created.",
      error: "Failed to create a new course flowsheet.",
    });
  };

  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100"
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Home" icon={Home} onClick={returnHome} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          {/*I think this is a bit redundant */}
          {/* <Item onClick={handleCreate} label="New note" icon={PlusCircle} /> */}
        </div>
        <div className="mt-2">
          <Item onClick={returnDocuments} label="Notes" icon={Notebook} />
          <div className="ml-2">
            <Item
              onClick={handleCreateNote}
              label="New note"
              icon={PlusCircle}
            />
            <DocumentList />
          </div>
        </div>
        <div className="mt-2">
          <Item
            onClick={returnCourseFlowsheets}
            label="CourseFlowsheet"
            icon={Sheet}
          />
          <div className="ml-2">
            <Item
              onClick={handleCreateCourseFlowsheet}
              label="New course flowsheet"
              icon={PlusCircle}
            />
            <FlowsheetList />
          </div>
        </div>
        <div>
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[9999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};
