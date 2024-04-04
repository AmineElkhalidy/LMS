"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required!",
  }),
});

const CreatePage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/teacher/courses/${response?.data?.id}`);
      console.log(response);
      toast.success("Course created Successfully!");
    } catch {
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="max-w-5xl mx-auto h-full p-6 flex md:items-center md:justify-center">
      <div className="w-full h-full">
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your course?
          <br /> Don&apos;t worry, you can change it later.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g 'Advanced React concepts'"
                    />
                  </FormControl>
                  <FormDescription>
                    What you will teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                className="bg-sky-700 duration-300 hover:bg-sky-900"
                disabled={!isValid || isSubmitting}
              >
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePage;
