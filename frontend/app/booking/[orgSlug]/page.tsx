"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import { publicBookingApi } from "@/lib/api/publicBooking";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Box,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import ServiceList from "@/components/PublicBookingComponents/ServiceList";
import DatePicker from "@/components/PublicBookingComponents/DatePicker";
import SlotPicker from "@/components/PublicBookingComponents/SlotPicker";
import BookingForm from "@/components/PublicBookingComponents/BookingForm";

const Page = () => {
  const params = useParams();
  const orgSlug = params.orgSlug as string;
  const formRef = useRef<HTMLDivElement>(null);

  const [organization, setOrganization] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const org = await publicBookingApi.getOrganizationBySlug(orgSlug);
        setOrganization(org);
        const servicesData = await publicBookingApi.getServices(org.id);
        setServices(servicesData);
      } catch (err) {
        toast.error("Business not found.");
      }
    };
    if (orgSlug) init();
  }, [orgSlug]);

  const fetchSlots = useCallback(
    async (service: any, selectedDate: Date, isSilent = false) => {
      if (!isSilent) setLoadingSlots(true);
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const freshSlots = await publicBookingApi.getSlots(
          service.id,
          formattedDate,
        );

        setSlots((prev) =>
          JSON.stringify(prev) === JSON.stringify(freshSlots)
            ? prev
            : freshSlots,
        );

        if (
          selectedSlot &&
          freshSlots.length > 0 &&
          !freshSlots.includes(selectedSlot)
        ) {
          setSelectedSlot("");
          toast.error("That slot was just taken!");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSlots(false);
      }
    },
    [selectedSlot],
  );

  useEffect(() => {
    if (!selectedService || !date) return;
    fetchSlots(selectedService, date, false);
    const interval = setInterval(
      () => fetchSlots(selectedService, date, true),
      10000,
    );
    return () => clearInterval(interval);
  }, [selectedService, date, fetchSlots]);

  // Smooth scroll to form when slot is selected
  useEffect(() => {
    if (selectedSlot && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedSlot]);

  if (!organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Skeleton className="h-[500px] w-full max-w-2xl rounded-[3rem]" />
      </div>
    );
  }

  const step = !selectedService ? 1 : !date ? 2 : !selectedSlot ? 3 : 4;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      {/* Dynamic Header */}
      <div className="w-full bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-white/80">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {organization.name}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Verified
              Merchant
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
              Step {step}/4
            </p>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto p-6 space-y-12 mt-8">
        {/* 1. SERVICE */}
        <section className="space-y-6">
          <SectionHeader
            number="1"
            title="Select Service"
            active={!!selectedService}
          />
          <ServiceList
            services={services}
            selected={selectedService}
            onSelect={(s: any) => {
              setSelectedService(s);
              setDate(undefined);
              setSelectedSlot("");
            }}
          />
        </section>

        {/* 2. DATE */}
        {selectedService && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionHeader number="2" title="Select Date" active={!!date} />
            <DatePicker value={date} onChange={setDate} />
          </section>
        )}

        {/* 3. TIME */}
        {date && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <SectionHeader
              number="3"
              title="Available Times"
              active={!!selectedSlot}
            />
            <SlotPicker
              slots={slots}
              selected={selectedSlot}
              onSelect={setSelectedSlot}
              loading={loadingSlots}
            />
          </section>
        )}

        {/* 4. FORM */}
        {selectedSlot && (
          <div
            ref={formRef}
            className="animate-in fade-in zoom-in duration-700"
          >
            <BookingForm
              service={selectedService}
              date={date}
              slot={selectedSlot}
              onSuccess={() => {
                setSelectedSlot("");
                fetchSlots(selectedService, date!, false);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating Price Summary (Mobile) */}
      {selectedSlot && !loadingSlots && (
        <div className="fixed bottom-6 left-6 right-6 z-50 md:hidden animate-in slide-in-from-bottom-10">
          <div className="bg-slate-900 text-white p-4 rounded-[2rem] shadow-2xl flex justify-between items-center border border-white/10 backdrop-blur-xl">
            <div className="pl-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Final Price
              </p>
              <p className="text-xl font-black italic">
                ₹{selectedService.price}
              </p>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pr-2">
              {selectedSlot} <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component for Section Headers
const SectionHeader = ({
  number,
  title,
  active,
}: {
  number: string;
  title: string;
  active: boolean;
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 shadow-sm ${active ? "bg-emerald-500 text-white scale-90 rotate-[360deg]" : "bg-white border border-slate-100 text-slate-400"}`}
    >
      {active ? <CheckCircle2 className="w-6 h-6" /> : number}
    </div>
    <h2
      className={`text-xl font-black tracking-tight transition-colors ${active ? "text-slate-900" : "text-slate-300"}`}
    >
      {title}
    </h2>
  </div>
);

export default Page;
