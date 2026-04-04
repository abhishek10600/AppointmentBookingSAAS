"use client";

import {
  Clock,
  IndianRupee,
  Video,
  MapPin,
  CalendarCheck,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PreviewProps {
  data: {
    title: string;
    description: string;
    durationInMinutes: number;
    price: number;
    serviceType: string;
    locationAddress?: string;
  };
}

export function ServicePreview({ data }: PreviewProps) {
  return (
    <div className="flex flex-col h-full border-2 border-dashed rounded-[2rem] bg-slate-50/50 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3" /> Customer View
        </span>
        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4 transition-all">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-xl text-slate-900 leading-tight break-words">
            {data.title || "Untitled Service"}
          </h3>
          <Badge
            variant="secondary"
            className="capitalize shrink-0 bg-primary/10 text-primary hover:bg-primary/10 border-none"
          >
            {data.serviceType.toLowerCase()}
          </Badge>
        </div>

        <p className="text-sm text-slate-500 leading-relaxed min-h-[60px]">
          {data.description || "Describe your service to attract clients..."}
        </p>

        <div className="flex items-center gap-6 py-3 border-y border-slate-50">
          <div className="flex items-center text-sm font-semibold text-slate-700">
            <Clock className="w-4 h-4 mr-2 text-primary" />
            {data.durationInMinutes || 0}m
          </div>
          <div className="flex items-center text-sm font-bold text-slate-900">
            <IndianRupee className="w-4 h-4 mr-0.5 text-slate-900" />
            {data.price || 0}
          </div>
        </div>

        {data.serviceType === "OFFLINE" && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-50 p-2 rounded-lg truncate">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {data.locationAddress || "No address provided yet"}
          </div>
        )}

        <button
          type="button"
          className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md"
        >
          <CalendarCheck className="w-4 h-4" />
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
