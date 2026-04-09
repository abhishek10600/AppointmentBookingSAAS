"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import {
  LogOut,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  User,
  Sun,
  Moon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0  w-full px-6 py-3">
      <div className="max-w-full h-16 bg-background/70 backdrop-blur-xl border border-border shadow-sm rounded-[2rem] px-6 flex items-center justify-between transition-all duration-300">
        {/* Brand */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-primary rounded-[1.2rem] flex items-center justify-center shadow-md group-hover:rotate-[10deg] transition-transform duration-500">
            <Sparkles className="text-primary-foreground w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-foreground leading-none">
              Schedora
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground mt-1">
              Scheduling Suite
            </span>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            className="p-2 rounded-xl hover:bg-muted transition cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl border border-border hover:bg-muted transition cursor-pointer group">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-foreground">
                      {user?.name}
                    </span>
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black h-4 px-1.5 uppercase tracking-tighter">
                      Active
                    </Badge>
                  </div>

                  <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                    {user?.email}
                  </span>
                </div>

                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black">
                    <User />
                  </AvatarFallback>
                </Avatar>

                <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors mr-1" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-64 rounded-[1.8rem] p-2 shadow-lg border border-border"
            >
              <div className="px-4 py-4 mb-2 bg-muted rounded-[1.4rem]">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Account Verified
                </p>

                <p className="text-sm font-black text-foreground truncate">
                  {user?.name}
                </p>

                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuItem
                onClick={() => dispatch(logout())}
                className="rounded-xl py-3 cursor-pointer text-destructive focus:bg-destructive/10 transition group"
              >
                <LogOut className="mr-3 h-4 w-4 opacity-70 group-hover:opacity-100" />
                <span className="font-black uppercase text-[10px] tracking-[0.15em]">
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
