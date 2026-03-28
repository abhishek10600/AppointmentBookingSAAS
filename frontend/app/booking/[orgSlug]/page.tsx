"use client";

import BookingForm from "@/components/PublicBookingComponents/BookingForm";
import DatePicker from "@/components/PublicBookingComponents/DatePicker";
import ServiceList from "@/components/PublicBookingComponents/ServiceList";
import SlotPicker from "@/components/PublicBookingComponents/SlotPicker";
import { publicBookingApi } from "@/lib/api/publicBooking";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const Page = () => {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [organization, setOrganization] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch org + services
  useEffect(() => {
    const init = async () => {
      const org = await publicBookingApi.getOrganizationBySlug(orgSlug);
      setOrganization(org);

      const services = await publicBookingApi.getServices(org.id);
      setServices(services);
    };

    if (orgSlug) init();
  }, [orgSlug]);

  // 🔥 Smart slot fetcher (no flicker)
  const fetchSlots = async (service: any, selectedDate: Date) => {
    if (isInitialLoad) setLoadingSlots(true);

    const formattedDate = selectedDate.toISOString().split("T")[0];

    const freshSlots = await publicBookingApi.getSlots(
      service.id,
      formattedDate,
    );

    // ✅ Prevent unnecessary UI updates
    setSlots((prev) => {
      const isSame =
        prev.length === freshSlots.length &&
        prev.every((s, i) => s === freshSlots[i]);

      return isSame ? prev : freshSlots;
    });

    // Reset invalid selection
    if (!freshSlots.includes(selectedSlot)) {
      setSelectedSlot("");
    }

    setLoadingSlots(false);
    setIsInitialLoad(false);
  };

  // Initial fetch
  useEffect(() => {
    if (!selectedService || !date) return;

    setIsInitialLoad(true);
    fetchSlots(selectedService, date);
  }, [selectedService, date]);

  // Auto refresh (silent)
  useEffect(() => {
    if (!selectedService || !date) return;

    const interval = setInterval(() => {
      fetchSlots(selectedService, date);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedService, date, selectedSlot]);

  if (!organization) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="h-40 w-[400px]" />
      </div>
    );
  }

  const step = !selectedService ? 1 : !date ? 2 : !selectedSlot ? 3 : 4;
  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-2xl font-semibold">
            {organization.name}
          </CardTitle>

          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground">Step {step} of 4</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SERVICE */}
          <ServiceList
            services={services}
            selected={selectedService}
            onSelect={(service: any) => {
              setSelectedService(service);
              setDate(undefined);
              setSlots([]);
              setSelectedSlot("");
              setIsInitialLoad(true);
            }}
          />

          {/* DATE */}
          {selectedService && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <DatePicker value={date} onChange={setDate} />
            </div>
          )}

          {/* SLOT */}
          {date && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <SlotPicker
                slots={slots}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
                loading={loadingSlots}
              />
            </div>
          )}

          {/* FORM */}
          {selectedSlot && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <BookingForm
                service={selectedService}
                date={date}
                slot={selectedSlot}
                onSuccess={() => {
                  setSelectedSlot("");
                  fetchSlots(selectedService, date!);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
