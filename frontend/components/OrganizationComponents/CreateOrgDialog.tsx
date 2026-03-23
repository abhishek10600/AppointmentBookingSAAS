"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { createOrganizationThunk } from "@/redux/slices/organizationSlice";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  organizationSchema,
  OrganizationFormData,
} from "@/lib/validators/organization";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CreateOrgDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      timezone: "Asia/Kolkata",
    },
  });

  const onSubmit = async (values: OrganizationFormData) => {
    await dispatch(createOrganizationThunk(values));
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Organization</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="My Company"
              {...register("name")}
              onChange={(e) => {
                const value = e.target.value;

                // update name
                setValue("name", value);

                // auto-generate slug
                const slug = value
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "");

                setValue("slug", slug);
              }}
            />
            <p className="text-sm text-red-500 min-h-[20px]">
              {errors.name?.message}
            </p>
          </div>

          {/* Slug */}
          <div className="space-y-1">
            <Label>Slug</Label>
            <Input placeholder="my-company" {...register("slug")} />
            <p className="text-sm text-red-500 min-h-[20px]">
              {errors.slug?.message}
            </p>
          </div>

          {/* Timezone */}
          <div className="space-y-1">
            <Label>Timezone</Label>
            <Input {...register("timezone")} />
            <p className="text-sm text-red-500 min-h-[20px]">
              {errors.timezone?.message}
            </p>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
