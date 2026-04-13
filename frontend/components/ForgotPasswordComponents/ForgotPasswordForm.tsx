"use client";

import { useState } from "react";
import { authApi } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Loader2, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error: any) {
      // In a real app, use toast.error here
      console.error("Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* fixed inset-0 ensures no scrollbars and perfect centering like your Login form */
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background Decorative Elements (Theme Ready) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-muted/50 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none bg-card relative z-10 overflow-hidden">
        {/* Brand Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {!isSubmitted ? (
          <>
            <CardHeader className="space-y-2 text-center pt-10">
              <div className="mx-auto w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center mb-2 shadow-lg -rotate-3">
                <KeyRound className="text-background w-5 h-5" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter text-foreground">
                Reset Password
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                We'll send a secure recovery link to your email address.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-4">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="relative space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      className="pl-11 h-12 rounded-xl bg-muted/30 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      "Send Recovery Link"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full font-bold text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        ) : (
          /* Success State UI */
          <CardContent className="p-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-500 w-10 h-10 animate-in zoom-in duration-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tighter text-foreground">
                Link Sent!
              </h2>
              <p className="text-muted-foreground font-medium">
                Check <span className="text-foreground font-bold">{email}</span>{" "}
                for instructions to reset your password.
              </p>
            </div>
            <Button
              className="w-full h-12 rounded-xl font-black"
              onClick={() => router.push("/auth/login")}
            >
              Return to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
