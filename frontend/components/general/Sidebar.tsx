"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Calendar,
  BookOpen,
  Plug,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  {
    name: "Organizations",
    path: "/dashboard/organizations",
    icon: Building2,
  },
  { name: "Services", path: "/dashboard/services", icon: Briefcase },
  { name: "Availability", path: "/dashboard/availability", icon: Calendar },
  { name: "Bookings", path: "/dashboard/bookings", icon: BookOpen },
  { name: "Integrations", path: "/dashboard/integrations", icon: Plug },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={cn(
        "h-screen border-r bg-background p-4 hidden md:flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold tracking-tight">Menu</h2>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => {
          // const isActive = pathname.startsWith(item.path);
          const isActive =
            item.path === "/dashboard"
              ? pathname === item.path
              : pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;

          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              onClick={() => router.push(item.path)}
              className={cn(
                "justify-start gap-2 cursor-pointer",
                collapsed && "justify-center",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              <Icon className="h-4 w-4" />

              {!collapsed && <span>{item.name}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Bottom Section (optional user/profile area) */}
      <div className="mt-auto pt-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed && "justify-center")}
        >
          {!collapsed ? "Profile" : "👤"}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
