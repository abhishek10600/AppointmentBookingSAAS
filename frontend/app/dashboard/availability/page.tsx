"use client";

import AddSlotDialog from "@/components/AvailabilityComponents/AddSlotDialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  deleteAvailabilityThunk,
  fetchAvailability,
} from "@/redux/slices/availabilitySlice";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AvailabilityPage = () => {
  const dispatch = useAppDispatch();

  const { currentOrgId } = useAppSelector((s) => s.org);
  const { slots, isLoading } = useAppSelector((s) => s.availability);

  useEffect(() => {
    if (currentOrgId) {
      dispatch(fetchAvailability(currentOrgId));
    }
  }, [currentOrgId, dispatch]);

  if (!currentOrgId) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Please select an organization
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Availability</h1>

      {isLoading && (
        <p className="text-muted-foreground">Loading availability...</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {days.map((day, index) => {
          const daySlots = slots
            .filter((s) => s.dayofWeek === index)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          return (
            <div
              key={index}
              className="border rounded-2xl p-5 bg-background shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{day}</h2>
                <AddSlotDialog day={index} />
              </div>

              {/* Content */}
              {daySlots.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
                  No slots added
                </div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex justify-between items-center px-4 py-2 rounded-lg bg-muted hover:bg-muted/70 transition"
                    >
                      <span className="font-medium">
                        {formatTime(slot.startTime)} –{" "}
                        {formatTime(slot.endTime)}
                      </span>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 cursor-pointer"
                        onClick={async () => {
                          try {
                            await dispatch(
                              deleteAvailabilityThunk(slot.id),
                            ).unwrap();
                            toast.success("Slot deleted");
                          } catch (err: any) {
                            toast.error(err || "Failed");
                          }
                        }}
                      >
                        Delete
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
