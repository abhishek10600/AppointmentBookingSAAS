"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { billingApi } from "@/lib/api/billing";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import {
  Check,
  Zap,
  ShieldCheck,
  Loader2,
  Percent,
  ArrowRight,
  TrendingUp,
  Star,
} from "lucide-react";

const BillingPage = () => {
  const { organizations, currentOrgId } = useAppSelector((s) => s.org);
  const org = organizations.find((o) => o.id === currentOrgId);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    try {
      setIsProcessing(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) return toast.error("Payment Gateway failed to load");

      const res = await billingApi.createSubscription(currentOrgId!);
      const razorpay = new (window as any).Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        subscription_id: res.id,
        name: "Pro Upgrade",
        handler: () => window.location.reload(),
        theme: { color: "#0F172A" },
      });
      razorpay.open();
    } catch {
      toast.error("Upgrade failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl space-y-12 p-6 pb-24">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <Badge className="bg-primary/10 text-primary hover:bg-primary/10 border-none px-4 py-1 rounded-full font-bold">
          PRICING & PLANS
        </Badge>
        <h1 className="text-5xl font-black tracking-tighter text-slate-900">
          Scale your business,{" "}
          <span className="text-primary underline decoration-primary/20">
            not your fees.
          </span>
        </h1>
        <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
          Choose the plan that fits your current stage. Switch or cancel
          anytime.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        {/* FREE PLAN CARD */}
        <Card
          className={`rounded-[3rem] border-2 transition-all p-2 ${org?.plan === "FREE" ? "border-slate-200 bg-white shadow-sm" : "border-transparent opacity-60"}`}
        >
          <CardContent className="p-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">Starter</h3>
                <p className="text-slate-500 text-sm font-medium">
                  For those just starting out.
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black">Free</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-2 text-amber-600">
                <Percent className="w-5 h-5 font-bold" />
                <span className="font-black text-lg tracking-tight">
                  8% Platform Fee
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                We take a small cut from each booking so you can start with zero
                upfront costs.
              </p>
            </div>

            {org?.plan === "FREE" ? (
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 font-bold pointer-events-none text-slate-400"
              >
                Current Plan
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 font-bold"
              >
                Downgrade to Starter
              </Button>
            )}
          </CardContent>
        </Card>

        {/* PRO PLAN CARD (The "Recommended" one) */}
        <Card
          className={`rounded-[3rem] border-4 relative transition-all p-2 ${org?.plan === "PRO" ? "border-emerald-500 shadow-emerald-100" : "border-primary shadow-2xl shadow-primary/20 bg-slate-900 text-white"}`}
        >
          {org?.plan !== "PRO" && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-1 rounded-full text-xs font-black tracking-widest shadow-lg">
              MOST POPULAR
            </div>
          )}

          <CardContent className="p-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black tracking-tight">
                    Professional
                  </h3>
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <p
                  className={`${org?.plan === "PRO" ? "text-slate-500" : "text-slate-400"} text-sm font-medium`}
                >
                  For serious entrepreneurs.
                </p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black">₹699</span>
                <span className="opacity-50 text-sm font-bold">/mo</span>
              </div>
            </div>

            <div
              className={`rounded-3xl p-6 mb-8 border transition-colors ${org?.plan === "PRO" ? "bg-emerald-50 border-emerald-100" : "bg-white/10 border-white/10"}`}
            >
              <div
                className={`flex items-center gap-3 mb-2 ${org?.plan === "PRO" ? "text-emerald-600" : "text-emerald-400"}`}
              >
                <TrendingUp className="w-5 h-5 font-bold" />
                <span className="font-black text-xl tracking-tighter">
                  0% Platform Fee
                </span>
              </div>
              <p
                className={`text-xs leading-relaxed font-medium ${org?.plan === "PRO" ? "text-slate-600" : "text-slate-400"}`}
              >
                Keep 100% of your earnings. No hidden charges on your
                hard-earned bookings.
              </p>
            </div>

            {org?.plan === "FREE" ? (
              <Button
                onClick={handleUpgrade}
                disabled={isProcessing}
                className="w-full h-16 rounded-2xl text-xl font-black bg-primary text-white shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Upgrade to Pro"
                )}{" "}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <div className="w-full h-16 rounded-2xl bg-emerald-500 flex items-center justify-center gap-2 font-black text-white">
                <ShieldCheck className="w-6 h-6" /> ACTIVE PRO PLAN
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col items-center gap-6 pt-6 border-t border-slate-100 text-slate-400">
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
          Secure Checkout Powered By Razorpay
        </p>
        <div className="flex gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          <ShieldCheck className="w-8 h-8" />
          <Zap className="w-8 h-8" />
          <Check className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
