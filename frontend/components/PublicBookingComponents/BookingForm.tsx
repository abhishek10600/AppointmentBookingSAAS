"use client";

import { useState } from "react";
import { publicBookingApi } from "@/lib/api/publicBooking";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function BookingForm({ service, date, slot, onSuccess }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!service || !date || !slot) {
      toast.error("Please complete all steps");
      return;
    }

    if (!name || !email) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const startTime = new Date(
        `${date.toISOString().split("T")[0]}T${slot}:00`,
      ).toISOString();

      await publicBookingApi.createBooking({
        serviceId: service.id,
        organizationId: service.organizationId,
        customerName: name,
        customerEmail: email,
        startTime,
      });

      toast.success("Booking confirmed 🎉");

      setName("");
      setEmail("");

      onSuccess?.();
    } catch (err: any) {
      if (err?.response?.data?.message === "Time slot already booked") {
        toast.error("This slot was just taken. Pick another.");
        onSuccess?.();
      } else {
        toast.error("Booking failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 border-t pt-5">
      <div>
        <p className="text-sm font-semibold">Your Details</p>
        <p className="text-xs text-muted-foreground">
          Enter your info to confirm booking
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full text-base font-semibold cursor-pointer py-5"
      >
        {loading ? "Confirming..." : "Confirm Booking"}
      </Button>
    </div>
  );
}
