"use client";

import { useState } from "react";
import { publicBookingApi } from "@/lib/api/publicBooking";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingForm({ service, date, slot, onSuccess }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    // console.log("load razorpay");

    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const handleSubmit = async () => {
    if (!service || !date || !slot) {
      toast.error("Please complete all steps");
      return;
    }

    if (!name || !email) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      // console.log("hello");
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const startTime = new Date(
        `${date.toISOString().split("T")[0]}T${slot}:00`,
      ).toISOString();

      const bookingData = {
        serviceId: service.id,
        organizationId: service.organizationId,
        customerName: name,
        customerEmail: email,
        startTime,
      };

      console.log(bookingData);

      const order = await publicBookingApi.createOrder({
        serviceId: service.id,
        startTime,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: service.title,
        description: "Service Booking",

        handler: async function (response: any) {
          try {
            await publicBookingApi.verifyPayment({ ...response, bookingData });
            toast.success("Your booking has been confirmed");
            setName("");
            setEmail("");
            onSuccess?.();
          } catch (error: any) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name,
          email,
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function () {
        toast.error("Payment failed. Please try again");
      });
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
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
        {loading ? "Processing" : "Confirm Booking"}
      </Button>
    </div>
  );
}
