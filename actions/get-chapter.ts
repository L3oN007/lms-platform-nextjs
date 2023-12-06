import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";
interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter && !course) {
      throw new Error("Chapter or Course not found");
    }

    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    let chapterVideo: any = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    if (chapter?.isFree || purchase) {
      chapterVideo = await db.chapter.findUnique({
        where: {
          id: chapterId,
        },
        select: {
          videoUrl: true,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      attachments,
      nextChapter,
      userProgress,
      purchase,
      chapterVideo,
    };
  } catch (error) {
    console.log("GET CHAPTER ERROR: ", error);
    return {
      chapter: null,
      course: null,
      attachment: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
