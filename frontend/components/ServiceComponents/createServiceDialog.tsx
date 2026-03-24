"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createServiceThunk } from "@/redux/slices/serviceSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createServiceSchema,
  createServiceFormData,
} from "@/lib/validators/service";

export default function CreateServiceDialog() {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<createServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      description: "",
      durationInMinutes: 30,
      price: 0,
      serviceType: "ONLINE",
      locationAddress: "",
      currency: "INR",
    },
  });

  const serviceType = watch("serviceType");

  const onSubmit = async (data: createServiceFormData) => {
    if (!currentOrgId) {
      toast.error("Please select an organization first");
      return;
    }

    try {
      await dispatch(
        createServiceThunk({
          ...data,
          organizationId: currentOrgId,
        }),
      ).unwrap();

      toast.success("Service Created Successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
      console.error("CREATE SERVICE FAILED:", message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!currentOrgId} className="cursor-pointer">
          Create Service
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label>Title</Label>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input {...register("description")} />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <Label>Duration (minutes)</Label>
            <Input
              type="number"
              {...register("durationInMinutes", { valueAsNumber: true })}
            />
            {errors.durationInMinutes && (
              <p className="text-red-500 text-sm">
                {errors.durationInMinutes.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price.message}</p>
            )}
          </div>

          {/* Service Type */}
          <div>
            <Label>Service Type</Label>
            <select
              {...register("serviceType")}
              className="w-full border rounded px-2 py-2"
            >
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </select>
          </div>

          {/* Location (ONLY if OFFLINE) */}
          {serviceType === "OFFLINE" && (
            <div>
              <Label>Location Address</Label>
              <Input {...register("locationAddress")} />
              {errors.locationAddress && (
                <p className="text-red-500 text-sm">
                  {errors.locationAddress.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
