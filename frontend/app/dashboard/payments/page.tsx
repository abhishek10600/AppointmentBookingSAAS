"use client";

import { bankApiService } from "@/lib/api/bank";
import { BankFormData } from "@/lib/validators/bank";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import BankForm from "@/components/BankComponents/BankForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const PaymentsPage = () => {
  const [bank, setBank] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const fetchBankDetail = async () => {
    try {
      setLoading(true);
      const data = await bankApiService.getUserBankDetail();
      setBank(data);
    } catch {
      setBank(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankDetail();
  }, []);

  const formDefaults: Partial<BankFormData> | undefined = bank
    ? {
        accountHolderName: bank.accountHolderName,
        bankName: bank.bankName,
        bankBranch: bank.bankBranch,
        ifscCode: bank.ifscCode,
        accountNumber: "",
      }
    : undefined;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Bank Details</h2>

        {bank && (
          <Button
            onClick={() => setOpenForm(true)}
            className="cursor-pointer hover:scale-110"
          >
            Edit
          </Button>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      ) : bank ? (
        /* Bank Card */
        <div className="rounded-2xl border p-6 shadow-sm bg-white space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Account Holder</p>
            <p className="font-medium">
              {bank.accountHolderName.toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Bank</p>
              <p className="font-medium">{bank.bankName.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p className="font-medium">{bank.bankBranch.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">IFSC</p>
              <p className="font-medium">{bank.ifscCode.toUpperCase()}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Account</p>
              <p className="font-medium">
                •••• •••• {bank?.accountNumberLast4}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="border rounded-2xl p-6 text-center space-y-4">
          <p className="text-muted-foreground">No bank details added yet</p>
          <Button
            onClick={() => setOpenForm(true)}
            className="cursor-pointer hover:scale-110"
          >
            Add Bank Details
          </Button>
        </div>
      )}

      {/* Modal */}
      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bank ? "Edit Bank Details" : "Add Bank Details"}
            </DialogTitle>
          </DialogHeader>

          <BankForm
            defaultValues={formDefaults}
            maskedAccount={bank?.accountNumber}
            onClose={() => {
              setOpenForm(false);
              fetchBankDetail();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
