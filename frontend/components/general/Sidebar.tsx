"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Plug,
  ChevronLeft,
  ChevronRight,
  ReceiptText,
  Landmark,
  Settings,
  CircleHelp,
} from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Organizations", path: "/dashboard/organizations", icon: Building2 },
  { name: "Services", path: "/dashboard/services", icon: Briefcase },
  { name: "Availability", path: "/dashboard/availability", icon: Calendar },
  { name: "Bookings", path: "/dashboard/bookings", icon: BookOpen },
  { name: "Integrations", path: "/dashboard/integrations", icon: Plug },
  { name: "Payouts", path: "/dashboard/payments", icon: Landmark },
  { name: "Billing", path: "/dashboard/billing", icon: ReceiptText },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-[calc(100vh-80px)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        collapsed ? "w-24 px-3" : "w-72 px-4",
      )}
    >
      {/* Container */}
      <div className="flex flex-col h-full bg-card border border-border rounded-[2.5rem] shadow-sm overflow-hidden">
        {/* Toggle */}
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground animate-in fade-in duration-500">
              Platform
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-2 rounded-xl hover:bg-muted text-muted-foreground transition-all active:scale-90",
              collapsed && "mx-auto",
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? pathname === item.path
                : pathname === item.path ||
                  pathname.startsWith(item.path + "/");

            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={cn(
                  "group relative flex w-full items-center gap-4 rounded-[1.2rem] px-4 py-3.5 transition-all duration-300 outline-none cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground group-hover:rotate-12",
                  )}
                />

                {!collapsed && (
                  <span className="text-sm font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-500">
                    {item.name}
                  </span>
                )}

                {/* Active dot */}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                )}

                {/* Tooltip */}
                {collapsed && (
                  <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left bg-popover text-popover-foreground text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-xl z-50 pointer-events-none shadow-lg">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 mt-auto border-t border-border space-y-1">
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all group">
            <CircleHelp className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            {!collapsed && <span className="tracking-tight">Support</span>}
          </button>

          <Link
            href="/dashboard/settings"
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all group"
          >
            <Settings className="h-5 w-5 text-muted-foreground group-hover:text-foreground cursor-pointer" />
            {!collapsed && <span className="tracking-tight">Settings</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
