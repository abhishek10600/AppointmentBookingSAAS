"use client";

import { useState } from "react";
import { registerSchema, RegisterUserFormData } from "@/lib/validators/auth";
import { useAppDispatch } from "@/redux/hooks";
import { registerUserThunk } from "@/redux/slices/authSlice";
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
import {
  Loader2,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterUserFormData) => {
    try {
      await dispatch(registerUserThunk(data)).unwrap();
      toast.success("Account created!");
      router.push("/dashboard");
    } catch (error: any) {
      const message =
        typeof error === "string" ? error : error?.message || "Failed";
      toast.error(message);
      setError("email", { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md rounded-[2rem] border-border shadow-xl bg-card overflow-hidden">
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-black text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join our platform today
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Name Field */}
            <div className="relative space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className={`pl-11 h-12 rounded-xl bg-muted border-none transition-all text-foreground placeholder:text-muted-foreground/50 ${
                    errors.name
                      ? "ring-2 ring-destructive/50"
                      : "focus-visible:ring-2 focus-visible:ring-primary/20"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="absolute -bottom-5 left-1 text-[10px] font-bold text-destructive uppercase flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="w-3 h-3" /> {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="relative space-y-1.5">
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className={`pl-11 h-12 rounded-xl bg-muted border-none transition-all text-foreground placeholder:text-muted-foreground/50 ${
                    errors.email
                      ? "ring-2 ring-destructive/50"
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
              <Label className="text-[10px] font-black uppercase text-muted-foreground ml-1">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-11 pr-11 h-12 rounded-xl bg-muted border-none transition-all text-foreground placeholder:text-muted-foreground/50 ${
                    errors.password
                      ? "ring-2 ring-destructive/50"
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
              className="w-full h-14 rounded-2xl font-black text-base shadow-lg hover:scale-[1.01] active:scale-95 transition-all mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Register"
              )}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/auth/login")}
              className="text-primary font-black hover:underline cursor-pointer"
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
