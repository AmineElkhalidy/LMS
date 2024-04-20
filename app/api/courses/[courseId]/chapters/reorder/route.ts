import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PUT(
  request: Request,
  {
    params,
  }: {
    params: { courseId: string };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    const { list } = await request?.json();
    const ownCourse = await db?.course?.findUnique({
      where: {
        id: params?.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized!", { status: 401 });
    }

    for (let item of list) {
      await db?.chapter?.update({
        where: {
          id: item?.id,
        },
        data: { position: item?.psotion },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[RE-ORDER]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
