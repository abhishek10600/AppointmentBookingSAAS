"use client";

import { useState } from "react";
import { publicBookingApi } from "@/lib/api/publicBooking";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreditCard, Loader2, User, Mail, Sparkles } from "lucide-react";

export default function BookingForm({ service, date, slot, onSuccess }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email)
      return toast.error("Please provide your name and email");
    setLoading(true);

    try {
      const isLoaded = await new Promise((resolve) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!isLoaded) throw new Error("Payment gateway failed");

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

      const order = await publicBookingApi.createOrder({
        serviceId: service.id,
        startTime,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: order.order.amount,
        currency: order.order.currency,
        order_id: order.order.id,
        name: "Finalize Booking",
        description: `${service.title} @ ${slot}`,
        handler: async (response: any) => {
          try {
            await publicBookingApi.verifyPayment({ ...response, bookingData });
            toast.success("Booking Confirmed!");
            setName("");
            setEmail("");
            onSuccess?.();
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name, email },
        theme: { color: "#0F172A" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative overflow-hidden group">
        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-slate-100 group-hover:text-primary/5 transition-colors" />

        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                Total to Pay
              </p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">
                ₹{service.price}
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 text-right">
                Duration
              </p>
              <p className="font-bold text-slate-700">
                {service.durationInMinutes} Minutes
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                Your Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input
                  className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus:ring-primary/20 shadow-sm"
                  placeholder="e.g. John Wick"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-slate-500 ml-1">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <Input
                  type="email"
                  className="pl-11 h-12 rounded-xl bg-white border-slate-200 focus:ring-primary/20 shadow-sm"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all gap-3 bg-primary text-white cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-5 h-5" /> Securing Slot...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" /> Confirm & Pay Now
          </>
        )}
      </Button>
    </div>
  );
}
