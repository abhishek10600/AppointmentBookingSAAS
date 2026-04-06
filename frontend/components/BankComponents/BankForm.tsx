"use client";

import { bankApiService } from "@/lib/api/bank";
import { BankFormData, bankFormSchema } from "@/lib/validators/bank";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  Landmark,
  MapPin,
  Hash,
  Loader2,
} from "lucide-react";

type Props = {
  defaultValues?: Partial<BankFormData>;
  maskedAccount?: string;
  onClose: () => void;
};

const BankForm = ({ defaultValues, maskedAccount, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: BankFormData) => {
    try {
      const payload = {
        ...data,
        ...(data.accountNumber?.trim()
          ? { accountNumber: data.accountNumber }
          : {}),
      };
      await bankApiService.upsertBankDetail(payload);
      toast.success("Security update successful");
      onClose();
    } catch {
      toast.error("Security handshake failed. Try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Holder Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            <User className="w-3 h-3" /> Account Holder
          </label>
          <Input
            className="h-12 rounded-xl border-slate-200 focus:ring-primary/20"
            placeholder="John Doe"
            {...register("accountHolderName")}
          />
          {errors.accountHolderName && (
            <p className="text-red-500 text-[10px] font-bold ml-1">
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        {/* IFSC Code */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            <Hash className="w-3 h-3" /> IFSC Code
          </label>
          <Input
            className="h-12 rounded-xl border-slate-200 uppercase"
            placeholder="HDFC0001234"
            {...register("ifscCode")}
            onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-[10px] font-bold ml-1">
              {errors.ifscCode.message}
            </p>
          )}
        </div>

        {/* Account Number */}
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> New Account Number
          </label>
          <Input
            className="h-12 rounded-xl border-slate-200 font-mono tracking-widest"
            placeholder={maskedAccount ? "•••• •••• ••••" : "0000 0000 0000"}
            {...register("accountNumber")}
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
          <p className="text-[10px] text-slate-400 font-bold italic ml-1">
            {maskedAccount
              ? "Leave blank to keep existing account"
              : "Enter digits only"}
          </p>
          {errors.accountNumber && (
            <p className="text-red-500 text-[10px] font-bold ml-1">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Bank Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            <Landmark className="w-3 h-3" /> Bank Name
          </label>
          <Input
            className="h-12 rounded-xl border-slate-200"
            placeholder="Global Bank"
            {...register("bankName")}
          />
          {errors.bankName && (
            <p className="text-red-500 text-[10px] font-bold ml-1">
              {errors.bankName.message}
            </p>
          )}
        </div>

        {/* Branch */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Branch Name
          </label>
          <Input
            className="h-12 rounded-xl border-slate-200"
            placeholder="Downtown Branch"
            {...register("bankBranch")}
          />
          {errors.bankBranch && (
            <p className="text-red-500 text-[10px] font-bold ml-1">
              {errors.bankBranch.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-6 border-t border-slate-100">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-14 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/10 active:scale-95 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Account
            </>
          ) : (
            "Confirm Payout Details"
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="h-12 rounded-xl font-bold text-slate-400 hover:text-slate-900 cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BankForm;
