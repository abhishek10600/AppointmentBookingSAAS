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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddSlotDialog = ({ day }: { day: number }) => {
  const dispatch = useAppDispatch();
  const { currentOrgId } = useAppSelector((s) => s.org);

  const [open, setOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentOrgId) {
      toast.error("Please select an organization");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Start time must be earlier than end time");
      return;
    }

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

      toast.success("Slot added");

      // ✅ UX FIX
      setOpen(false);
      setStartTime("09:00");
      setEndTime("17:00");
    } catch (error: any) {
      toast.error(error || "Failed to add slot");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="hover:scale-105 transition"
        >
          + Add Slot
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Time Slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Start Time</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">End Time</label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Slot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSlotDialog;
