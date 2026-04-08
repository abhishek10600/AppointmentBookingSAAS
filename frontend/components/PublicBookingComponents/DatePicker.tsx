"use client";

import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ value, onChange }: any) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">Select a Date</p>
      <div className="rounded-2xl border border-border p-3 shadow-sm bg-card">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
        />
      </div>
    </div>
  );
}
