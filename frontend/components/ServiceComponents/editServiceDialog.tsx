"use client";

import { useState } from "react";
import { IService } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { updateServiceThunk } from "@/redux/slices/serviceSlice";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export default function EditServiceDialog({ service }: { service: IService }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: service,
  });

  const onSubmit = async (data: any) => {
    try {
      await dispatch(
        updateServiceThunk({
          serviceId: service.id,
          data,
        }),
      ).unwrap();
      toast.success("Service Updated Successfully");
      //   toast({ title: "Updated successfully" });
      setOpen(false);
    } catch {
      //   toast({ title: "Update failed", variant: "destructive" });
      toast.error("Failed To Update The Service");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="cursor-pointer">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} />
          <Input {...register("description")} />
          <Input
            type="number"
            {...register("durationInMinutes", { valueAsNumber: true })}
          />
          <Input
            type="number"
            {...register("price", { valueAsNumber: true })}
          />

          <Button type="submit" className="cursor-pointer">
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
