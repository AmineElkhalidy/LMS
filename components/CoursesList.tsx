import React from "react";
import { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface Props {
  items: CourseWithProgressWithCategory[];
}

const CoursesList = ({ items }: Props) => {
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <CourseCard
            key={index}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chaptersLength={item.chapters.length}
            price={item.price!}
            progress={item.progress}
            category={item?.category?.name!}
          />
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground mt-10">
          No courses found!
        </p>
      )}
    </div>
  );
};

export default CoursesList;
