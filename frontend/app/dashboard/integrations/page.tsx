"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { checkGoogleStatus, connectGoogle } from "@/lib/api/integration";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Link as LinkIcon,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

const IntegrationPage = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  const currentOrgId = useAppSelector((s) => s.org.currentOrgId);

  useEffect(() => {
    if (success === "true") {
      toast.success("Google Calendar connected successfully", {
        description: "Your bookings will now sync automatically.",
      });
    }
  }, [success]);

  useEffect(() => {
    const fetchGoogleStatus = async () => {
      if (!currentOrgId) return;
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
      return toast.error("Please select an organization first");
    }
    const url = connectGoogle(currentOrgId as string);
    window.location.href = url;
  };

  return (
    <div className="max-w-7xl space-y-10 p-6">
      <header className="space-y-2">
        <h2 className="text-5xl font-black tracking-tighter text-slate-900">
          Integrations
        </h2>
        <p className="text-muted-foreground text-lg">
          Connect your favorite tools to streamline your workflow.
        </p>
      </header>

      <div className="grid gap-6">
        <Card
          className={`overflow-hidden border-2 transition-all duration-300 rounded-[2rem] ${connected ? "border-green-100 bg-green-50/20" : "hover:border-slate-300"}`}
        >
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Left Side: Brand & Info */}
              <div className="flex items-start gap-5">
                <div
                  className={`p-4 rounded-2xl ${connected ? "bg-white shadow-sm" : "bg-slate-100"}`}
                >
                  {/* Google Icon Approximation */}
                  <svg width="32" height="32" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">Google Calendar</h3>
                    {connected && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-full px-2">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
                    Automatically sync all your appointments to your personal
                    calendar and prevent double-booking.
                  </p>

                  {connected && email && (
                    <div className="flex items-center gap-2 mt-3 p-2 px-3 bg-white border border-green-100 rounded-xl w-fit shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-slate-600">
                        Synced with{" "}
                        <span className="text-slate-900 font-bold">
                          {email}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Action Button */}
              <div className="w-full md:w-auto">
                {loading ? (
                  <Button
                    disabled
                    className="w-full md:w-32 h-12 rounded-2xl bg-slate-100 text-slate-400"
                  >
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Checking
                  </Button>
                ) : connected ? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 uppercase tracking-tighter">
                      <ShieldCheck className="w-3 h-3" /> Secure Connection
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnect}
                    className="w-full md:w-32 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2 cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!currentOrgId && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            Please select an organization from the sidebar to manage your
            integrations.
          </p>
        </div>
      )}
    </div>
  );
};

export default IntegrationPage;
