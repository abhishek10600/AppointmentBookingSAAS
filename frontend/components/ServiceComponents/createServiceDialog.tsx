// "use client";

// import { useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { createServiceThunk } from "@/redux/slices/serviceSlice";
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
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { toast } from "sonner";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   createServiceSchema,
//   createServiceFormData,
// } from "@/lib/validators/service";
// import {
//   Plus,
//   Loader2,
//   IndianRupee,
//   Clock,
//   Laptop,
//   MapPin,
// } from "lucide-react";
// import { ServicePreview } from "./ServicePreview";

// export default function CreateServiceDialog() {
//   const dispatch = useAppDispatch();
//   const { currentOrgId } = useAppSelector((s) => s.org);
//   const [open, setOpen] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm<createServiceFormData>({
//     resolver: zodResolver(createServiceSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       durationInMinutes: 30,
//       price: 0,
//       serviceType: "ONLINE",
//       locationAddress: "",
//       currency: "INR",
//     },
//   });

//   const formData = watch();

//   const onSubmit = async (data: createServiceFormData) => {
//     if (!currentOrgId) return toast.error("Select organization first");
//     try {
//       await dispatch(
//         createServiceThunk({ ...data, organizationId: currentOrgId }),
//       ).unwrap();
//       toast.success("Service created successfully!");
//       reset();
//       setOpen(false);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to create service");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button
//           disabled={!currentOrgId}
//           className="rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 gap-2 cursor-pointer"
//         >
//           <Plus className="w-4 h-4" /> Create Service
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="max-w-[95vw] lg:max-w-[900px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
//         <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
//           {/* Form Side */}
//           <div className="flex-1 p-8 overflow-y-auto bg-white">
//             <DialogHeader className="mb-6">
//               <DialogTitle className="text-2xl font-bold tracking-tight">
//                 Setup New Service
//               </DialogTitle>
//               <DialogDescription>
//                 Define what you offer and how much you charge.
//               </DialogDescription>
//             </DialogHeader>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div className="space-y-2">
//                 <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
//                   Basic Info
//                 </Label>
//                 <Input
//                   placeholder="e.g., Executive Coaching"
//                   className="h-12 rounded-xl focus:ring-primary"
//                   {...register("title")}
//                 />
//                 {errors.title && (
//                   <p className="text-destructive text-xs italic">
//                     {errors.title.message}
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <Textarea
//                   placeholder="Briefly describe the value of this session..."
//                   className="rounded-xl min-h-[100px] resize-none"
//                   {...register("description")}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4 pt-2">
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2 font-semibold">
//                     <Clock className="w-4 h-4" /> Duration
//                   </Label>
//                   <Input
//                     type="number"
//                     className="h-12 rounded-xl"
//                     {...register("durationInMinutes", { valueAsNumber: true })}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label className="flex items-center gap-2 font-semibold">
//                     <IndianRupee className="w-4 h-4" /> Price
//                   </Label>
//                   <Input
//                     type="number"
//                     className="h-12 rounded-xl"
//                     {...register("price", { valueAsNumber: true })}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4 pt-2">
//                 <Label className="font-semibold">Meeting Format</Label>
//                 <Controller
//                   control={control}
//                   name="serviceType"
//                   render={({ field }) => (
//                     <Tabs
//                       value={field.value}
//                       onValueChange={field.onChange}
//                       className="w-full"
//                     >
//                       <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl p-1 bg-muted/50">
//                         <TabsTrigger
//                           value="ONLINE"
//                           className="rounded-lg gap-2"
//                         >
//                           <Laptop className="w-4 h-4" /> Online
//                         </TabsTrigger>
//                         <TabsTrigger
//                           value="OFFLINE"
//                           className="rounded-lg gap-2"
//                         >
//                           <MapPin className="w-4 h-4" /> Offline
//                         </TabsTrigger>
//                       </TabsList>
//                     </Tabs>
//                   )}
//                 />
//               </div>

//               {formData.serviceType === "OFFLINE" && (
//                 <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
//                   <Label className="font-semibold">Address / Location</Label>
//                   <Input
//                     placeholder="Enter physical location"
//                     className="h-12 rounded-xl bg-slate-50"
//                     {...register("locationAddress")}
//                   />
//                 </div>
//               )}

//               <Button
//                 type="submit"
//                 className="w-full h-14 cursor-pointer text-lg font-bold rounded-2xl mt-4 shadow-xl hover:shadow-primary/20"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 animate-spin" /> Finalizing...
//                   </>
//                 ) : (
//                   "Launch Service"
//                 )}
//               </Button>
//             </form>
//           </div>

//           {/* Preview Side */}
//           <div className="hidden lg:flex w-[380px] bg-slate-100 p-8 flex-col justify-center border-l">
//             <ServicePreview data={formData} />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createServiceSchema,
  createServiceFormData,
} from "@/lib/validators/service";
import {
  Plus,
  Loader2,
  IndianRupee,
  Clock,
  Laptop,
  MapPin,
} from "lucide-react";
import { ServicePreview } from "./ServicePreview";

export default function CreateServiceDialog() {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
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

  const formData = watch();

  const onSubmit = async (data: createServiceFormData) => {
    if (!currentOrgId) return toast.error("Select organization first");

    try {
      await dispatch(
        createServiceThunk({ ...data, organizationId: currentOrgId }),
      ).unwrap();

      toast.success("Service created successfully!");
      reset();
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to create service");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!currentOrgId}
          className="rounded-2xl px-6 h-12 font-bold shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95 gap-2"
        >
          <Plus className="w-4 h-4" /> Create Service
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-[95vw] lg:max-w-[900px] p-0 overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Form Side */}
          <div className="flex-1 p-8 overflow-y-auto bg-background">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
                Setup New Service
              </DialogTitle>
              <DialogDescription>
                Define what you offer and how much you charge.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Basic Info
                </Label>

                <Input
                  placeholder="e.g., Executive Coaching"
                  className="h-12 rounded-xl"
                  {...register("title")}
                />

                {errors.title && (
                  <p className="text-destructive text-xs italic">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Briefly describe the value of this session..."
                  className="rounded-xl min-h-[100px] resize-none"
                  {...register("description")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 font-semibold">
                    <Clock className="w-4 h-4 text-primary" /> Duration
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
                  <Label className="flex items-center gap-2 font-semibold">
                    <IndianRupee className="w-4 h-4 text-primary" /> Price
                  </Label>

                  <Input
                    type="number"
                    className="h-12 rounded-xl"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <Label className="font-semibold text-foreground">
                  Meeting Format
                </Label>

                <Controller
                  control={control}
                  name="serviceType"
                  render={({ field }) => (
                    <Tabs
                      value={field.value}
                      onValueChange={field.onChange}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl p-1 bg-muted">
                        <TabsTrigger
                          value="ONLINE"
                          className="rounded-lg gap-2"
                        >
                          <Laptop className="w-4 h-4" /> Online
                        </TabsTrigger>

                        <TabsTrigger
                          value="OFFLINE"
                          className="rounded-lg gap-2"
                        >
                          <MapPin className="w-4 h-4" /> Offline
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                />
              </div>

              {formData.serviceType === "OFFLINE" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="font-semibold text-foreground">
                    Address / Location
                  </Label>

                  <Input
                    placeholder="Enter physical location"
                    className="h-12 rounded-xl bg-muted"
                    {...register("locationAddress")}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-2xl mt-4 shadow-xl hover:shadow-primary/20 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" /> Finalizing...
                  </>
                ) : (
                  "Launch Service"
                )}
              </Button>
            </form>
          </div>

          {/* Preview Side */}
          <div className="hidden lg:flex w-[380px] bg-muted p-8 flex-col justify-center border-l border-border">
            <ServicePreview data={formData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
