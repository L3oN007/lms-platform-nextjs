import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseEnrollButton } from "./_components/course-enroll-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { CourseProgressButton } from "./_components/course-progress-button";

export async function generateMetadata({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const chapter = await db.chapter.findUnique({
    where: {
      courseId: params.courseId,
      id: params.chapterId,
    },
  });

  return {
    title: chapter?.title || "Chapter",
  };
}

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    chapterVideo,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter"
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            courseId={params.courseId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            nextChapterId={nextChapter?.id}
            videoUrl={chapterVideo?.videoUrl}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div className="p-4">
            <h2 className="mb-2 text-2xl font-semibold">Description</h2>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                <h2 className="mb-2 text-2xl font-semibold">Attachments</h2>
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    key={attachment.id}
                    target="_blank"
                    className="flex w-full items-center rounded-md border bg-green-200 p-3 text-emerald-700 hover:underline"
                  >
                    <File className="mr-2 h-4 w-4" />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
