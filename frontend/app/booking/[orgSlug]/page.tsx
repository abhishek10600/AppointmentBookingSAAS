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
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const params = useParams();
  const orgSlug = params.orgSlug as string;

  const [organization, setOrganization] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    const init = async () => {
      const org = await publicBookingApi.getOrganizationBySlug(orgSlug);
      setOrganization(org);

      const services = await publicBookingApi.getServices(org.id);
      setServices(services);
    };

    if (orgSlug) init();
  }, [orgSlug]);

  useEffect(() => {
    if (!selectedService || !date) return;

    const fetchSlots = async () => {
      const formattedDate = date.toISOString().split("T")[0];
      const slots = await publicBookingApi.getSlots(
        selectedService.id,
        formattedDate,
      );
      setSlots(slots);
    };

    fetchSlots();
  }, [selectedService, date]);

  if (!organization) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="h-40 w-[400px]" />
      </div>
    );
  }

  const step = !selectedService ? 1 : !date ? 2 : !selectedSlot ? 3 : 4;

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">
            {organization.name}
          </CardTitle>

          {/* Step Indicator */}
          <div className="flex gap-2">
            {["Service", "Date", "Time", "Details"].map((label, i) => (
              <Badge
                key={label}
                variant={step >= i + 1 ? "default" : "secondary"}
              >
                {label}
              </Badge>
            ))}
          </div>
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
            }}
          />

          {/* DATE */}
          {selectedService && <DatePicker value={date} onChange={setDate} />}

          {/* SLOT */}
          {date && (
            <SlotPicker
              slots={slots}
              selected={selectedSlot}
              onSelect={setSelectedSlot}
            />
          )}

          {/* FORM */}
          {selectedSlot && (
            <BookingForm
              service={selectedService}
              date={date}
              slot={selectedSlot}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
