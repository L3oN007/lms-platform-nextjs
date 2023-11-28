import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";

const ChapterIdPage = async ({
  params,
}: {
  params: { chapterId: string; courseId: string };
}) => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
    },
  });

  if (!chapter) return redirect("/");

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between ">
        <div className="w-full">
          <Link
            className="mb-6 flex items-center text-sm transition hover:opacity-75"
            href={`/teacher/courses/${chapter.courseId}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to course setup
          </Link>

          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-y-2 ">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-slate-700">
                Complete all field {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-6  md:grid-cols-2 ">
        <div className="space-y-4 ">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl ">Customize your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
            <ChapterDescriptionForm
              initialData={chapter}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">Access Setting</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={chapter.courseId}
              chapterId={chapter.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
