"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  createOrganizationThunk,
  setCurrentOrg,
} from "@/redux/slices/organizationSlice";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Link2, Globe2, Briefcase, Plus } from "lucide-react";

export default function CreateOrgDialog({
  trigger,
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "", slug: "", timezone: "Asia/Kolkata" },
  });

  const nameValue = watch("name");

  // Logic: Sync slug with name ONLY if user hasn't manually edited the slug
  useEffect(() => {
    if (!isSlugCustomized && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, isSlugCustomized, setValue]);

  const onSubmit = async (values: OrganizationFormData) => {
    const res = await dispatch(createOrganizationThunk(values));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Welcome aboard!", {
        description: `${values.name} has been created.`,
      });
      if (res.payload?.id) dispatch(setCurrentOrg(res.payload.id));
      reset();
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) reset();
        setIsSlugCustomized(false);
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button className="rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> Create Organization
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            New Organization
          </DialogTitle>
          <DialogDescription>
            Set up a new workspace for your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold ml-1">
              Organization Name
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Acme Corp"
                className="pl-10 h-11 rounded-xl focus-visible:ring-primary"
                {...register("name")}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-destructive ml-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <Label htmlFor="slug" className="text-sm font-semibold">
                Workspace URL
              </Label>
              {isSlugCustomized && (
                <button
                  type="button"
                  onClick={() => setIsSlugCustomized(false)}
                  className="text-[10px] uppercase tracking-wider font-bold text-primary hover:underline"
                >
                  Reset to Auto
                </button>
              )}
            </div>
            <div className="relative">
              <Link2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="slug"
                placeholder="acme-corp"
                className="pl-10 h-11 rounded-xl bg-muted/30"
                {...register("slug")}
                onChange={(e) => {
                  setIsSlugCustomized(true);
                  register("slug").onChange(e);
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground ml-1">
              Your dashboard:{" "}
              <span className="text-foreground font-medium">
                app.yoursite.com/{watch("slug") || "..."}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone" className="text-sm font-semibold ml-1">
              Timezone
            </Label>
            <div className="relative">
              <Globe2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="timezone"
                className="pl-10 h-11 rounded-xl"
                {...register("timezone")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 cursor-pointer text-lg font-semibold rounded-xl mt-2 transition-all active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...
              </>
            ) : (
              "Create Workspace"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
