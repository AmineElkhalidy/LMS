import { Chapter, Course, UserProgress } from "@prisma/client";
import React from "react";
import { Menu } from "lucide-react";
import CourseSidebar from "./CourseSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Props {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

const CourseMobileSidebar = ({ course, progressCount }: Props) => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white w-72">
        <CourseSidebar course={course} progressCount={progressCount} />
      </SheetContent>
    </Sheet>
  );
};

export default CourseMobileSidebar;
