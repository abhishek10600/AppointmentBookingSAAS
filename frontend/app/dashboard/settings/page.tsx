"use client";

import ResetPasswordForm from "@/components/SettingsComponents/ResetPasswordForm";
import { ShieldCheck, UserCircle, BellRing, CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SettingsPage = () => {
  return (
    <div className="max-w-7xl">
      <header className="mb-10">
        <h1 className="text-5xl font-black tracking-tighter text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground font-medium mt-2">
          Manage your account preferences and security settings.
        </p>
      </header>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-2xl mb-8 border border-border/50">
          <TabsTrigger
            value="profile"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <UserCircle className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger
            value="billing"
            className="rounded-xl px-6 font-bold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" /> Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="security"
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none"
        >
          <div className="bg-card text-card-foreground border border-border/60 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <ShieldCheck className="text-primary w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black leading-none">
                  Security Center
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Keep your account safe and updated.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-[2rem] p-8 border border-border/50">
              <div className="max-w-full">
                <h3 className="text-lg font-black mb-1">Reset Password</h3>
                <p className="text-sm text-muted-foreground font-medium mb-8">
                  Ensure your new password is at least 8 characters long.
                </p>
                <ResetPasswordForm />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
