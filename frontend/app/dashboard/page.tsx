"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, isLoading } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <Button className="cursor-pointer" onClick={() => dispatch(logout())}>
        Logout
      </Button>
    </div>
  );
}
