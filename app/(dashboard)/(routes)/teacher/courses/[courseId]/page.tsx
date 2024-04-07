import React from "react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { IconBadge } from "@/components/IconBadge";
import { LayoutDashboard } from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";

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

  // Get the categories from db
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const options = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

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
            Complete all fields {`${completionText}`}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2 font-medium">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-lg">Customize your course</h2>
          </div>

          <TitleForm initialData={course} courseId={course?.id} />
          <DescriptionForm initialData={course} courseId={course?.id} />
          <ImageForm initialData={course} courseId={course?.id} />
          <CategoryForm
            initialData={course}
            courseId={course?.id}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
