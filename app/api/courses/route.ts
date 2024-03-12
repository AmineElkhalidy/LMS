import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    const { title } = await request.json();
    console.log(title);

    if (!userId) {
      return new NextResponse("Unauthorized!", { status: 405 });
    }

    // Create the course
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
