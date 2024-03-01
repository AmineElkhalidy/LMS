import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const CoursesPage = () => {
  return (
    <div className="p-6">
      <Link href="/teacher/create">
        <Button className="bg-sky-700 duration-300 hover:bg-sky-900">
          New Course
        </Button>
      </Link>
    </div>
  );
};

export default CoursesPage;
