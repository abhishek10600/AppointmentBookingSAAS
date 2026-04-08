// "use client";

// import { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   deleteAvailabilityThunk,
//   fetchAvailability,
//   createAvailabilityThunk,
// } from "@/redux/slices/availabilitySlice";
// import AddSlotDialog from "@/components/AvailabilityComponents/AddSlotDialog";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { Clock, Trash2, CalendarDays, Copy, Loader2 } from "lucide-react";

// const AvailabilityPage = () => {
//   const dispatch = useAppDispatch();
//   const { currentOrgId } = useAppSelector((s) => s.org);
//   const { slots, isLoading } = useAppSelector((s) => s.availability);

//   useEffect(() => {
//     if (currentOrgId) dispatch(fetchAvailability(currentOrgId));
//   }, [currentOrgId, dispatch]);

//   const days = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   const formatTime = (time: string) => {
//     const [hour, minute] = time.split(":");
//     const h = parseInt(hour);
//     const suffix = h >= 12 ? "PM" : "AM";
//     const formattedHour = h % 12 || 12;
//     return `${formattedHour}:${minute} ${suffix}`;
//   };

//   const handleCopyMondayToWeekdays = async () => {
//     const mondaySlots = slots.filter((s) => s.dayofWeek === 0);
//     if (mondaySlots.length === 0)
//       return toast.error("Add slots to Monday first");

//     const targetDayIndices = [1, 2, 3, 4]; // Tuesday to Saturday (or include 6 for Sunday)

//     try {
//       toast.loading("Syncing schedule across the week...", {
//         id: "copy-loading",
//       });

//       // 1. Identify all existing slots on target days that we want to overwrite
//       const existingSlotsToDelete = slots.filter((s) =>
//         targetDayIndices.includes(s.dayofWeek),
//       );

//       // 2. Delete existing slots first to avoid duplicates/overlaps
//       if (existingSlotsToDelete.length > 0) {
//         await Promise.all(
//           existingSlotsToDelete.map((slot) =>
//             dispatch(deleteAvailabilityThunk(slot.id)).unwrap(),
//           ),
//         );
//       }

//       // 3. Now create the new slots based on Monday's template
//       const createPromises = targetDayIndices.flatMap((dayIndex) =>
//         mondaySlots.map((slot) =>
//           dispatch(
//             createAvailabilityThunk({
//               organizationId: currentOrgId!,
//               dayofWeek: dayIndex,
//               startTime: slot.startTime,
//               endTime: slot.endTime,
//             }),
//           ).unwrap(),
//         ),
//       );

//       await Promise.all(createPromises);

//       toast.dismiss("copy-loading");
//       toast.success("Schedule synced successfully!");
//     } catch (err) {
//       toast.dismiss("copy-loading");
//       toast.error("Failed to complete sync. Some slots might be missing.");
//     }
//   };

//   if (!currentOrgId)
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed rounded-3xl">
//         <CalendarDays className="w-12 h-12 mb-4 opacity-20" />
//         <p className="text-lg font-medium">
//           Select an organization to manage availability
//         </p>
//       </div>
//     );

//   return (
//     <div className="max-w-6xl mx-auto space-y-8">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-5xl font-black tracking-tighter text-slate-900">
//             Availability
//           </h1>
//           <p className="text-muted-foreground mt-1">
//             Set your recurring weekly work hours.
//           </p>
//         </div>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={handleCopyMondayToWeekdays}
//           className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 text-primary cursor-pointer"
//         >
//           <Copy className="w-4 h-4" /> Copy Monday to Weekdays
//         </Button>
//       </div>

//       {isLoading && (
//         <div className="flex items-center gap-3 text-muted-foreground animate-pulse">
//           <Loader2 className="w-5 h-5 animate-spin" />
//           <span>Syncing schedule...</span>
//         </div>
//       )}

//       <div className="grid lg:grid-cols-2 gap-8">
//         {days.map((day, index) => {
//           const daySlots = slots
//             .filter((s) => s.dayofWeek === index)
//             .sort((a, b) => a.startTime.localeCompare(b.startTime));

//           return (
//             <div
//               key={index}
//               className="group relative bg-card border-2 border-transparent hover:border-primary/10 rounded-[2rem] p-6 shadow-sm transition-all duration-300"
//             >
//               <div className="flex justify-between items-center mb-6">
//                 <div className="space-y-1">
//                   <h2 className="text-xl font-bold tracking-tight">{day}</h2>
//                   <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
//                     {daySlots.length} Active{" "}
//                     {daySlots.length === 1 ? "Slot" : "Slots"}
//                   </p>
//                 </div>
//                 <AddSlotDialog day={index} />
//               </div>

//               <div className="space-y-3">
//                 {daySlots.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-10 bg-slate-50/50 rounded-2xl border border-dashed text-muted-foreground">
//                     <Clock className="w-6 h-6 mb-2 opacity-20" />
//                     <span className="text-sm">Set a time slot</span>
//                   </div>
//                 ) : (
//                   daySlots.map((slot) => (
//                     <div
//                       key={slot.id}
//                       className="flex justify-between items-center px-5 py-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group/slot"
//                     >
//                       <div className="flex items-center gap-3">
//                         <div className="w-2 h-2 rounded-full bg-green-500" />
//                         <span className="font-bold text-slate-700 tabular-nums">
//                           {formatTime(slot.startTime)} —{" "}
//                           {formatTime(slot.endTime)}
//                         </span>
//                       </div>

//                       <Button
//                         size="icon"
//                         variant="ghost"
//                         className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/slot:opacity-100 transition-opacity cursor-pointer"
//                         onClick={async () => {
//                           try {
//                             await dispatch(
//                               deleteAvailabilityThunk(slot.id),
//                             ).unwrap();
//                             toast.success("Removed");
//                           } catch (err: any) {
//                             toast.error("Error");
//                           }
//                         }}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default AvailabilityPage;

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteAvailabilityThunk,
  fetchAvailability,
  createAvailabilityThunk,
} from "@/redux/slices/availabilitySlice";
import AddSlotDialog from "@/components/AvailabilityComponents/AddSlotDialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Clock, Trash2, CalendarDays, Copy, Loader2 } from "lucide-react";

const AvailabilityPage = () => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);
  const { slots, isLoading } = useAppSelector((s) => s.availability);

  useEffect(() => {
    if (currentOrgId) dispatch(fetchAvailability(currentOrgId));
  }, [currentOrgId, dispatch]);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const suffix = h >= 12 ? "PM" : "AM";
    const formattedHour = h % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  };

  const handleCopyMondayToWeekdays = async () => {
    const mondaySlots = slots.filter((s) => s.dayofWeek === 0);

    if (mondaySlots.length === 0) {
      return toast.error("Add slots to Monday first");
    }

    const targetDays = [1, 2, 3, 4]; // Tue–Sat

    try {
      toast.loading("Syncing schedule...", { id: "copy" });

      const existing = slots.filter((s) => targetDays.includes(s.dayofWeek));

      // delete old
      await Promise.all(
        existing.map((slot) =>
          dispatch(deleteAvailabilityThunk(slot.id)).unwrap(),
        ),
      );

      // create new
      await Promise.all(
        targetDays.flatMap((day) =>
          mondaySlots.map((slot) =>
            dispatch(
              createAvailabilityThunk({
                organizationId: currentOrgId!,
                dayofWeek: day,
                startTime: slot.startTime,
                endTime: slot.endTime,
              }),
            ).unwrap(),
          ),
        ),
      );

      toast.success("Schedule synced", { id: "copy" });
    } catch {
      toast.error("Sync failed", { id: "copy" });
    }
  };

  if (!currentOrgId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground border-2 border-dashed rounded-3xl">
        <CalendarDays className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg font-medium">
          Select an organization to manage availability
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black tracking-tighter">Availability</h1>
          <p className="text-muted-foreground mt-1">
            Set your weekly working hours
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleCopyMondayToWeekdays}
          className="rounded-full gap-2 cursor-pointer"
        >
          <Copy className="w-4 h-4" />
          Copy Monday
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="animate-spin w-4 h-4" />
          Loading...
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {days.map((day, index) => {
          const daySlots = slots
            .filter((s) => s.dayofWeek === index)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div key={day} className="bg-card border rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-lg">{day}</h2>
                <AddSlotDialog day={index} />
              </div>

              {daySlots.length === 0 ? (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 opacity-50" />
                  No slots added
                </div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center bg-muted p-3 rounded-xl"
                    >
                      <span className="font-medium">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </span>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        onClick={async () => {
                          try {
                            await dispatch(
                              deleteAvailabilityThunk(slot.id),
                            ).unwrap();
                            toast.success("Deleted");
                          } catch {
                            toast.error("Error");
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailabilityPage;
