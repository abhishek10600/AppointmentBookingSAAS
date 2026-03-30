"use client";

import { Button } from "@/components/ui/button";
import { checkGoogleStatus, connectGoogle } from "@/lib/api/integration";
import { useAppSelector } from "@/redux/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "lucide-react";

const IntegrationPage = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const currentOrgId = useAppSelector((s) => s.org.currentOrgId);

  useEffect(() => {
    if (success === "true") {
      toast.success("Google Connected Successfully");
    }
  }, [success]);

  useEffect(() => {
    const fetchGoogleStatus = async () => {
      if (!currentOrgId) {
        return;
      }
      try {
        setLoading(true);
        const res = await checkGoogleStatus(currentOrgId);
        setConnected(res.connected);
        setEmail(res.email);
      } catch (error) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchGoogleStatus();
  }, [currentOrgId, success]);

  const handleConnect = () => {
    if (!currentOrgId) {
      toast.error("Please select an organization");
    }

    const url = connectGoogle(currentOrgId as string);

    window.location.href = url;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl tracking-tight font-bold">Intgrations</h2>

      <div className="border rounded-xl p-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Google Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Sync bookings with Google Calendar
          </p>

          {connected && email && (
            <p>
              Connected as <span className="font-bold">{email}</span>
            </p>
          )}
        </div>

        {/* Conditional Rendering */}
        {loading ? (
          <Button disabled>
            <Spinner /> Loading
          </Button>
        ) : connected ? (
          <Button className="bg-green-600">Connected</Button>
        ) : (
          <Button
            onClick={handleConnect}
            className="cursor-pointer hover:scale-110"
          >
            <Link />
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationPage;
