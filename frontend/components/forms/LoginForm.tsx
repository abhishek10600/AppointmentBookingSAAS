"use client";

import { useState } from "react";
import { loginSchema, LoginUserFormData } from "@/lib/validators/auth";
import { useAppDispatch } from "@/redux/hooks";
import { loginUserThunk, registerUserThunk } from "@/redux/slices/authSlice"; // Note: Ensure this is loginUserThunk in your actual logic
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginUserFormData) => {
    try {
      await dispatch(loginUserThunk(data)).unwrap();
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || "Invalid credentials";
      toast.error("Login Failed");
      setError("email", { message });
      setError("password", { message });
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-muted rounded-full blur-3xl opacity-50" />
      </div>

      <Card className="w-full max-w-md rounded-[2.5rem] shadow-2xl border-border bg-card relative z-10 overflow-hidden">
        {/* Brand Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        <CardHeader className="space-y-2 text-center pt-10">
          <CardTitle className="text-3xl font-black tracking-tight text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Enter your details to continue to your dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Email Field */}
            <div className="relative space-y-1.5">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={`pl-11 h-12 rounded-xl bg-muted border-none transition-all placeholder:text-muted-foreground/50 ${
                    errors.email
                      ? "ring-2 ring-destructive/20"
                      : "focus-visible:ring-2 focus-visible:ring-primary/20"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-destructive uppercase flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="relative space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest text-muted-foreground"
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-70 transition-opacity"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-11 pr-11 h-12 rounded-xl bg-muted border-none transition-all placeholder:text-muted-foreground/50 ${
                    errors.password
                      ? "ring-2 ring-destructive/20"
                      : "focus-visible:ring-2 focus-visible:ring-primary/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 cursor-pointer" />
                  ) : (
                    <Eye className="w-4 h-4 cursor-pointer" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-destructive uppercase flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" /> {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Login to Dashboard"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="px-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em]">
              New here?
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register Link */}
          <p className="text-center">
            <Button
              variant="link"
              className="font-bold text-primary hover:no-underline p-0 h-auto cursor-pointer"
              onClick={() => router.push("/auth/register")}
            >
              Create your business account
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
