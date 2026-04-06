"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createAvailabilityThunk } from "@/redux/slices/availabilitySlice";
import React, { useState } from "react";
import { toast } from "sonner";
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
import { Clock, Loader2, Plus, Zap } from "lucide-react";

const AddSlotDialog = ({ day }: { day: number }) => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: "Full Day", start: "09:00", end: "17:00" },
    { label: "Morning", start: "09:00", end: "13:00" },
    { label: "Evening", start: "17:00", end: "21:00" },
  ];

  const handleSubmit = async () => {
    if (!currentOrgId) return toast.error("Select organization");
    if (startTime >= endTime)
      return toast.error("End time must be after start time");

    try {
      setLoading(true);
      await dispatch(
        createAvailabilityThunk({
          organizationId: currentOrgId,
          dayofWeek: day,
          startTime,
          endTime,
        }),
      ).unwrap();
      toast.success("Time slot added");
      setOpen(false);
    } catch (error: any) {
      toast.error(error || "Conflict detected");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full px-4 border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add Availability
          </DialogTitle>
          <DialogDescription>
            Define a block of time when you are bookable.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Quick Presets */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
              <Zap className="w-3 h-3" /> Quick Presets
            </Label>
            <div className="flex gap-2">
              {presets.map((p) => (
                <Button
                  key={p.label}
                  variant="secondary"
                  size="sm"
                  className="rounded-lg text-xs cursor-pointer"
                  onClick={() => {
                    setStartTime(p.start);
                    setEndTime(p.end);
                  }}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Start Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  className="pl-10 h-12 rounded-xl focus:ring-primary"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">End Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  className="pl-10 h-12 rounded-xl focus:ring-primary"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" />
            ) : (
              "Confirm Slot"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlotDialog;
