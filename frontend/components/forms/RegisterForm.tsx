"use client";

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
import { Loader2 } from "lucide-react";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      console.log(error);

      const message =
        typeof error === "string"
          ? error
          : error?.message || "Registration failed";

      toast.error(message);

      // Optional: show inline error
      setError("email", { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-2xl border border-border/50">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Enter Your Details
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11"
                {...register("name")}
              />
              {/* Fixed height error */}
              <p className="text-xs text-red-500 min-h-[16px]">
                {errors.name?.message}
              </p>
            </div>
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="h-11"
                {...register("email")}
              />
              {/* Fixed height error */}
              <p className="text-xs text-red-500 min-h-[16px]">
                {errors.email?.message}
              </p>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <span
                  className="text-xs text-muted-foreground hover:text-primary cursor-pointer"
                  onClick={() => console.log("Forgot password")}
                >
                  Forgot?
                </span>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
                {...register("password")}
              />

              {/* Fixed height error */}
              <p className="text-xs text-red-500 min-h-[16px]">
                {errors.password?.message}
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Your Account...
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="px-3 text-xs text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="font-medium text-primary hover:underline cursor-pointer"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
