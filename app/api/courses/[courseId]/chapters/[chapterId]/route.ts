import Mux from "@mux/mux-node";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!ownCourse) return new NextResponse("Unauthorized", { status: 401 });

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapter) return new NextResponse("Not Found", { status: 404 });

    if (chapter.videoUrl) {
      try {
        const existingMuxData = await db.muxData.findFirst({
          where: {
            chapterId: params.chapterId,
          },
        });

        // Log the existingMuxData to verify its content
        console.log("[Existing Mux Data]:", existingMuxData);

        //TODO: Some attention here
        if (existingMuxData) {
          try {
            await mux.video.assets.delete(existingMuxData.assetId);
            console.log(
              `[Mux Asset Deleted]: Asset ID - ${existingMuxData.assetId}`
            );
          } catch (muxError) {
            console.error("[Mux Asset Deletion Error]:", muxError);
            throw new Error("Failed to delete Mux asset");
          }

          try {
            await db.muxData.delete({
              where: {
                id: existingMuxData.id,
              },
            });
            console.log(
              `[Database Record Deleted]: Mux Data ID - ${existingMuxData.id}`
            );
          } catch (dbError) {
            console.error("[Database Deletion Error]:", dbError);
            throw new Error("Failed to delete muxData record from database");
          }
        }
      } catch (fetchError) {
        console.error("[Mux Data Fetch Error]:", fetchError);
        throw new Error("Failed to fetch Mux data for the chapter");
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapters.length) {
      await db.course.update({
        where: { id: params.courseId },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isPublished, ...values } = await request.json();

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: params.courseId, userId },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: { id: params.chapterId, courseId: params.courseId },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId,
        },
      });

      if (existingMuxData) {
        await mux.video.assets.delete(existingMuxData?.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData?.id,
          },
        });
      }

      const asset = await mux.video.assets.create({
        input: values.videoUrl,
        playback_policy: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
