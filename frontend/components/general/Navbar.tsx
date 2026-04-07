// "use client";

// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { Button } from "@/components/ui/button";
// import { logout } from "@/redux/slices/authSlice";

// const Navbar = () => {
//   const { user } = useAppSelector((s) => s.auth);
//   const dispatch = useAppDispatch();
//   return (
//     <header className="h-16 border-b bg-background flex items-center justify-between px-6">
//       {/* Left */}
//       <h1 className="text-3xl font-black tracking-tighter text-slate-900">
//         Schedora
//       </h1>

//       {/* Right */}
//       <div className="flex items-center gap-4">
//         <span className="text-sm text-muted-foreground">{user?.name}</span>

//         <Button
//           size="sm"
//           variant="destructive"
//           onClick={() => dispatch(logout())}
//           className="cursor-pointer"
//         >
//           Logout
//         </Button>
//       </div>
//     </header>
//   );
// };

// export default Navbar;

"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/slices/authSlice";
import {
  LogOut,
  Settings,
  Bell,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-[100] w-full px-6 py-3">
      {/* The Floating Glass Container */}
      <div className="max-w-full h-16 bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] px-6 flex items-center justify-between transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-900 rounded-[1.2rem] flex items-center justify-center shadow-2xl group-hover:rotate-[10deg] transition-transform duration-500 ease-out">
              <Sparkles className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-slate-900 leading-none">
              Schedora
            </h1>
            <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mt-1">
              Scheduling Suite
            </span>
          </div>
        </div>

        {/* Right: User Interface */}
        <div className="flex items-center gap-3">
          {/* User Profile Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <div className="flex items-center gap-3 p-1.5 pl-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all cursor-pointer group">
                <div className="hidden md:flex flex-col items-end mr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-800">
                      {user?.name}
                    </span>
                    <Badge className="bg-emerald-50 text-emerald-600 border-none text-[9px] font-black h-4 px-1.5 uppercase tracking-tighter">
                      Active
                    </Badge>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 truncate max-w-[120px]">
                    {user?.email}
                  </span>
                </div>

                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105">
                  <AvatarFallback className="bg-slate-900 text-white text-[10px] font-black">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors mr-1" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-64 rounded-[1.8rem] p-2 shadow-2xl border-slate-100 animate-in zoom-in-95 duration-200"
            >
              <div className="px-4 py-4 mb-2 bg-slate-50 rounded-[1.4rem]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Account Verified
                </p>
                <p className="text-sm font-black text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs font-medium text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuItem
                onClick={() => dispatch(logout())}
                className="rounded-xl py-3 cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600 transition-colors group"
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
