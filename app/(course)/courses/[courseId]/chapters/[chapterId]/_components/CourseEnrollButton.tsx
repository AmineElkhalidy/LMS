"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import React from "react";

interface Props {
  courseId: string;
  price: number;
}

const CourseEnrollButton = ({ courseId, price }: Props) => {
  return (
    <Button size="sm" className="w-full md:w-auto">
      Enroll for {formatPrice(price)}
    </Button>
  );
};

export default CourseEnrollButton;
