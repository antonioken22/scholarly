"use client";

import { useQuery } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { Table } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Flowsheet } from "./flowsheet";

export const FlowsheetList = () => {
  const params = useParams();
  const router = useRouter();

  const onRedirect = (courseFlowsheetId: string) => {
    router.push(`/course-flowsheets/${courseFlowsheetId}`);
  };

  const courseFlowsheets = useQuery(api.courseFlowsheets.getSidebar);

  if (courseFlowsheets === undefined) {
    return (
      <>
        <Flowsheet.Skeleton />
      </>
    );
  }

  return (
    <>
      <p className="text-sm font-medium text-muted-foreground/80"></p>
      {courseFlowsheets.map((courseFlowsheet) => (
        <div key={courseFlowsheet._id}>
          <Flowsheet
            id={courseFlowsheet._id}
            onClick={() => onRedirect(courseFlowsheet._id)}
            label={courseFlowsheet.program}
            icon={Table}
            active={params.courseFlowsheetId === courseFlowsheet._id}
          />
        </div>
      ))}
    </>
  );
};
