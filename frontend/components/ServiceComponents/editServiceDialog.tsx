// "use client";

// import { useState } from "react";
// import { IService } from "@/types";
// import { useAppDispatch } from "@/redux/hooks";
// import { updateServiceThunk } from "@/redux/slices/serviceSlice";
// import { toast } from "sonner";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   createServiceSchema,
//   createServiceFormData,
// } from "@/lib/validators/service";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Loader2,
//   Edit3,
//   Clock,
//   IndianRupee,
//   FileText,
//   Type,
// } from "lucide-react";
// import { ServicePreview } from "./ServicePreview";

// export default function EditServiceDialog({ service }: { service: IService }) {
//   const dispatch = useAppDispatch();
//   const [open, setOpen] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { isSubmitting, errors },
//   } = useForm<createServiceFormData>({
//     resolver: zodResolver(createServiceSchema),
//     defaultValues: {
//       title: service.title,
//       description: service.description || "",
//       durationInMinutes: service.durationInMinutes,
//       price: service.price,
//       // Keeping these as hidden defaults so the update payload remains valid
//       serviceType: service.serviceType,
//       locationAddress: service.locationAddress || "",
//       currency: service.currency || "INR",
//     },
//   });

//   const formData = watch();

//   const onSubmit = async (data: createServiceFormData) => {
//     try {
//       await dispatch(
//         updateServiceThunk({
//           serviceId: service.id,
//           data,
//         }),
//       ).unwrap();

//       toast.success("Service updated");
//       setOpen(false);
//     } catch (err: any) {
//       toast.error("Update failed");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className="rounded-xl px-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
//         >
//           <Edit3 className="w-3.5 h-3.5" /> Edit
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-[95vw] lg:max-w-[850px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
//         <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
//           {/* FORM SIDE */}
//           <div className="flex-1 p-8 overflow-y-auto bg-white">
//             <DialogHeader className="mb-8">
//               <DialogTitle className="text-2xl font-bold tracking-tight">
//                 Quick Edit
//               </DialogTitle>
//               <DialogDescription>
//                 Modify the core details of this service.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//               {/* Title */}
//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
//                   <Type className="w-3.5 h-3.5" /> Service Title
//                 </Label>
//                 <Input
//                   className="h-12 rounded-xl focus:ring-primary border-muted-foreground/20"
//                   {...register("title")}
//                 />
//                 {errors.title && (
//                   <p className="text-destructive text-xs ml-1">
//                     {errors.title.message}
//                   </p>
//                 )}
//               </div>

//               {/* Description */}
//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
//                   <FileText className="w-3.5 h-3.5" /> Description
//                 </Label>
//                 <Textarea
//                   className="rounded-xl min-h-[120px] resize-none border-muted-foreground/20"
//                   {...register("description")}
//                 />
//               </div>

//               {/* Price & Duration Grid */}
//               <div className="grid grid-cols-2 gap-6 pt-2">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
//                     <Clock className="w-3.5 h-3.5" /> Duration (min)
//                   </Label>
//                   <Input
//                     type="number"
//                     className="h-12 rounded-xl border-muted-foreground/20"
//                     {...register("durationInMinutes", { valueAsNumber: true })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
//                     <IndianRupee className="w-3.5 h-3.5" /> Price
//                   </Label>
//                   <Input
//                     type="number"
//                     className="h-12 rounded-xl border-muted-foreground/20 font-medium"
//                     {...register("price", { valueAsNumber: true })}
//                   />
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-6">
//                 <Button
//                   type="submit"
//                   className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 animate-spin h-5 w-5" />{" "}
//                       Updating...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </Button>
//               </div>
//             </form>
//           </div>

//           {/* PREVIEW SIDE */}
//           <div className="hidden lg:flex w-[350px] bg-slate-50 p-8 flex-col justify-center border-l border-slate-100">
//             <ServicePreview data={formData} />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import { IService } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { updateServiceThunk } from "@/redux/slices/serviceSlice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServiceSchema,
  createServiceFormData,
} from "@/lib/validators/service";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Edit3,
  Clock,
  IndianRupee,
  FileText,
  Type,
} from "lucide-react";
import { ServicePreview } from "./ServicePreview";

export default function EditServiceDialog({ service }: { service: IService }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<createServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: service.title,
      description: service.description || "",
      durationInMinutes: service.durationInMinutes,
      price: service.price,
      serviceType: service.serviceType,
      locationAddress: service.locationAddress || "",
      currency: service.currency || "INR",
    },
  });

  const formData = watch();

  const onSubmit = async (data: createServiceFormData) => {
    try {
      await dispatch(
        updateServiceThunk({
          serviceId: service.id,
          data,
        }),
      ).unwrap();

      toast.success("Service updated");
      setOpen(false);
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl px-4 gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-[850px] p-0 overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* FORM SIDE */}
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                Quick Edit
              </DialogTitle>
              <DialogDescription>
                Modify the core details of this service.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
                  <Type className="w-3.5 h-3.5" /> Service Title
                </Label>

                <Input className="h-12 rounded-xl" {...register("title")} />

                {errors.title && (
                  <p className="text-destructive text-xs ml-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
                  <FileText className="w-3.5 h-3.5" /> Description
                </Label>

                <Textarea
                  className="rounded-xl min-h-[120px] resize-none"
                  {...register("description")}
                />
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
                    <Clock className="w-3.5 h-3.5" /> Duration (min)
                  </Label>

                  <Input
                    type="number"
                    className="h-12 rounded-xl"
                    {...register("durationInMinutes", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-xs uppercase font-bold text-muted-foreground ml-1">
                    <IndianRupee className="w-3.5 h-3.5" /> Price
                  </Label>

                  <Input
                    type="number"
                    className="h-12 rounded-xl font-medium"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin h-5 w-5" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* PREVIEW SIDE */}
          <div className="hidden lg:flex w-[350px] bg-muted p-8 flex-col justify-center border-l border-border">
            <ServicePreview data={formData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
