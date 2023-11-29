"use client";

import axios from "axios";
import * as z from "zod";

import { Chapter } from "@prisma/client";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/video-player";

interface ChapterVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values,
      );
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200 font-bold text-slate-500">
            <Video className="mr-2 h-8 w-8 text-slate-500" />
            No video
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            {/* TODO: Apply video player */}
            <VideoPlayer
              videoUrl={initialData.videoUrl}
              width="100%"
              height="100%"
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url });
              }
            }}
          />
          <div className="mt-4 text-xs text-muted-foreground">
            Upload this chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="mt-4 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page if video
          does not appear.
        </div>
      )}
    </div>
  );
};
