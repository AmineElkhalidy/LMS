import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import { LayoutDashboard } from "lucide-react";

const CourseDetailsPage = async ({
  params,
}: {
  params: { courseId: string };
}) => {
  // Check if there is a user + if this user is the one who created the course
  const { userId } = auth();

  if (!userId) return redirect("/");

  // Get the course from db
  const course = await db.course.findFirst({ where: { id: params.courseId } });

  if (!course) return redirect("/");

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
  ];

  const totalFields = requiredFields.length;
  // ! this is genius
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Course setup</h1>
          <span className="text-sm text-slate-700">
            Complete all fields {`(${completionText})`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl">Customize your course</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
