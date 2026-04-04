"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Button } from "@/components/ui/button";
import { logout } from "@/redux/slices/authSlice";

const Navbar = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      {/* Left */}
      <h1 className="text-lg font-semibold">Schedora</h1>

      {/* Right */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{user?.name}</span>

        <Button
          size="sm"
          variant="destructive"
          onClick={() => dispatch(logout())}
          className="cursor-pointer"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
