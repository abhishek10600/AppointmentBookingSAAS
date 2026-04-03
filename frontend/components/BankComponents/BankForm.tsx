"use client";

import { bankApiService } from "@/lib/api/bank";
import { BankFormData, bankFormSchema } from "@/lib/validators/bank";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

      toast.success("Bank details saved successfully");
      onClose();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-5">
      {maskedAccount && (
        <p className="text-sm text-muted-foreground">
          Current Account: •••• ••••
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Account Holder Name</label>
          <Input {...register("accountHolderName")} />
          {errors.accountHolderName && (
            <p className="text-red-500 text-sm">
              {errors.accountHolderName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account Number</label>
          <Input
            placeholder="Enter new account number"
            {...register("accountNumber")}
            onChange={(e) =>
              (e.target.value = e.target.value.replace(/\D/g, ""))
            }
          />
          <p className="text-xs text-muted-foreground">
            Leave empty to keep existing account
          </p>
          {errors.accountNumber && (
            <p className="text-red-500 text-sm">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">IFSC Code</label>
          <Input
            {...register("ifscCode")}
            onChange={(e) => (e.target.value = e.target.value.toUpperCase())}
          />
          {errors.ifscCode && (
            <p className="text-red-500 text-sm">{errors.ifscCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Name</label>
          <Input {...register("bankName")} />
          {errors.bankName && (
            <p className="text-red-500 text-sm">{errors.bankName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Branch</label>
          <Input {...register("bankBranch")} />
          {errors.bankBranch && (
            <p className="text-red-500 text-sm">{errors.bankBranch.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer py-5"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="cursor-pointer py-5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BankForm;
