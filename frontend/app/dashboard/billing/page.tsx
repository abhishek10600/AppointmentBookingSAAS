"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { billingApi } from "@/lib/api/billing";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

const BillingPage = () => {
  const { organizations, currentOrgId } = useAppSelector((s) => s.org);

  const org = organizations.find((o) => o.id === currentOrgId);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async () => {
    const isLoaded = loadRazorpay();

    if (!isLoaded) {
      toast.error("Payment Gateway failed to load");
    }
    const res = await billingApi.createSubscription(currentOrgId!);

    const razorpay = new (window as any).Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
      subscription_id: res.id,
    });

    razorpay.open();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Billing</h1>

      <div className="mt-4">
        <p>
          Current Plan: <span className="font-bold">{org?.plan}</span>
        </p>
        {org?.subscriptionStatus === "ACTIVE" && (
          <p>
            Status:{" "}
            <Badge className="bg-green-500">{org?.subscriptionStatus}</Badge>
          </p>
        )}

        {org?.subscriptionStatus === "INACTIVE" && (
          <p>
            Status:{" "}
            <Badge className="bg-orange-500">{org?.subscriptionStatus}</Badge>
          </p>
        )}

        {org?.subscriptionStatus === "CANCELLED" && (
          <p>
            Status:{" "}
            <Badge className="bg-red-500">{org?.subscriptionStatus}</Badge>
          </p>
        )}

        {org?.plan === "FREE" && (
          <Button
            onClick={handleUpgrade}
            className="cursor-pointer hover:scale-110 my-4"
          >
            Upgrade to Pro (₹699/month)
          </Button>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
