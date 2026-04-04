"use client";

import { Calendar } from "@/components/ui/calendar";

export default function DatePicker({ value, onChange }: any) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Select a Date</p>

      <div className="rounded-2xl border p-3 shadow-sm bg-white">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
          }}
          // initialFocus
        />
      </div>
    </div>
  );
}
