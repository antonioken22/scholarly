"use client";

import { useState } from "react";
import { useMutation } from "convex/react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useCoverImage } from "@/hooks/use-cover-image";
import { SingleImageDropzone } from "../single-image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
  const params = useParams();
  const update = useMutation(api.documents.update);
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setSubmitting] = useState(false);

  const onClose = () => {
    setFile(undefined);
    setSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: coverImage.url,
        },
      });

      await update({
        id: params.documentId as Id<"documents">,
        coverImage: res.url,
      });

      onClose();
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Cover Image</h2>
        </DialogHeader>
        <DialogDescription>
          <h2 className="text-justified text-md font-semibold">
            Mobile Users: Use images with [21:9] aspect ratio for optimal view.
            <br />
            Tablet Users: Use images with [24:9] aspect ratio for optimal view.
            <br />
            Desktop Users: Use images with [27:9] aspect ratio for optimal view.
            <br />
            Huge Screen Users: Use images with [30:9] aspect ratio for optimal
            view.
            <br />
          </h2>
        </DialogDescription>
        <SingleImageDropzone
          className="w-full outline-none"
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
      </DialogContent>
    </Dialog>
  );
};
