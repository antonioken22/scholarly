"use client";

import Image from "next/image";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const CourseFlowsheetsPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.courseFlowsheets.create);

  const onCreate = () => {
    const promise = create({ title: "Program" }).then((courseFlowsheetId) =>
      router.push(`/course-flowsheets/${courseFlowsheetId}`)
    );

    toast.promise(promise, {
      loading: "Creating a new course flowsheet...",
      success: "New course flowsheet created!",
      error: "Failed to create a new course flowsheet.",
    });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height="300"
        width="300"
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height="300"
        width="300"
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Scholarly
      </h2>
      <p className="text-sm font-regular">
        Warning: Feature is still under-development.
      </p>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a course flowsheet
      </Button>
    </div>
  );
};

export default CourseFlowsheetsPage;
