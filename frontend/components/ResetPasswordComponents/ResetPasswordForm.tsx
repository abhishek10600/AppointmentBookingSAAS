// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState } from "react";
// import { authApi } from "@/lib/api/auth";

// const ResetPasswordForm = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const token = searchParams.get("token");

//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       setMessage("Invalid or missing token");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await authApi.resetPassword({
//         token,
//         newPassword: password,
//       });

//       setMessage(res.message);

//       setTimeout(() => {
//         router.push("/auth/login");
//       }, 2000);
//     } catch (error: any) {
//       setMessage(error?.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-20 space-y-6">
//       <h1 className="text-2xl font-semibold">Reset Password</h1>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="password"
//           placeholder="Enter new password"
//           className="w-full border p-3 rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-black text-white p-3 rounded"
//           disabled={loading}
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>
//       </form>

//       {message && <p className="text-sm text-gray-600">{message}</p>}
//     </div>
//   );
// };

// export default ResetPasswordForm;

"use client";

import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);

    try {
      await authApi.resetPassword({
        token,
        newPassword: password,
      });

      setIsSuccess(true);
      toast.success("Password has been reset");

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Theme-ready Background Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-muted/50 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none bg-card relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />

        {!isSuccess ? (
          <>
            <CardHeader className="space-y-2 text-center pt-10">
              <div className="mx-auto w-12 h-12 bg-foreground rounded-2xl flex items-center justify-center mb-2 shadow-lg -rotate-3">
                <Lock className="text-background w-5 h-5" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tighter text-foreground">
                Set New Password
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium px-6">
                Please enter a strong password that you haven't used before.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 pt-4">
              {!token ? (
                /* Error State if Token is missing */
                <div className="bg-destructive/10 p-4 rounded-2xl border border-destructive/20 flex items-center gap-3">
                  <ShieldAlert className="text-destructive w-5 h-5" />
                  <p className="text-xs font-bold text-destructive uppercase tracking-tight">
                    Invalid Session. Please request a new link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="relative space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      New Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-11 pr-11 h-12 rounded-xl bg-muted/30 border-none transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Confirm New Password"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </>
        ) : (
          /* Success Animation View */
          <CardContent className="p-10 text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-500 w-10 h-10 animate-in zoom-in duration-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tighter text-foreground">
                Success!
              </h2>
              <p className="text-muted-foreground font-medium">
                Your password has been updated. Redirecting you to login...
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
