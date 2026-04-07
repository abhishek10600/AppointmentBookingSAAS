// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";

// import {
//   LayoutDashboard,
//   Building2,
//   Briefcase,
//   Calendar,
//   BookOpen,
//   Plug,
//   ChevronLeft,
//   ChevronRight,
//   ReceiptText,
//   Landmark,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
//   {
//     name: "Organizations",
//     path: "/dashboard/organizations",
//     icon: Building2,
//   },
//   { name: "Services", path: "/dashboard/services", icon: Briefcase },
//   { name: "Availability", path: "/dashboard/availability", icon: Calendar },
//   { name: "Bookings", path: "/dashboard/bookings", icon: BookOpen },
//   { name: "Integrations", path: "/dashboard/integrations", icon: Plug },
//   { name: "Payouts", path: "/dashboard/payments", icon: Landmark },
//   { name: "Billing", path: "/dashboard/billing", icon: ReceiptText },
// ];

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   return (
//     <aside
//       className={cn(
//         "h-screen border-r bg-background p-4 hidden md:flex flex-col transition-all duration-300",
//         collapsed ? "w-20" : "w-64",
//       )}
//     >
//       {/* Top Section */}
//       <div className="flex items-center justify-between mb-6">
//         {!collapsed && (
//           <h2 className="text-xl font-bold tracking-tight">Menu</h2>
//         )}

//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => setCollapsed(!collapsed)}
//         >
//           {collapsed ? (
//             <ChevronRight className="h-4 w-4" />
//           ) : (
//             <ChevronLeft className="h-4 w-4" />
//           )}
//         </Button>
//       </div>

//       {/* Navigation */}
//       <nav className="flex flex-col gap-2 flex-1">
//         {menuItems.map((item) => {
//           // const isActive = pathname.startsWith(item.path);
//           const isActive =
//             item.path === "/dashboard"
//               ? pathname === item.path
//               : pathname === item.path || pathname.startsWith(item.path + "/");
//           const Icon = item.icon;

//           return (
//             <Button
//               key={item.name}
//               variant={isActive ? "default" : "ghost"}
//               onClick={() => router.push(item.path)}
//               className={cn(
//                 "justify-start gap-2 cursor-pointer",
//                 collapsed && "justify-center",
//                 isActive && "bg-primary text-primary-foreground",
//               )}
//             >
//               <Icon className="h-4 w-4" />

//               {!collapsed && <span>{item.name}</span>}
//             </Button>
//           );
//         })}
//       </nav>

//       {/* Bottom Section (optional user/profile area) */}
//       <div className="mt-auto pt-4 border-t">
//         <Button
//           variant="ghost"
//           className={cn("w-full justify-start", collapsed && "justify-center")}
//         >
//           {!collapsed ? "Profile" : "👤"}
//         </Button>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

// "use client";

// import { useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   LayoutDashboard,
//   Building2,
//   Briefcase,
//   Calendar,
//   BookOpen,
//   Plug,
//   ChevronLeft,
//   ChevronRight,
//   ReceiptText,
//   Landmark,
//   User,
//   HelpCircle,
// } from "lucide-react";

// const menuItems = [
//   { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
//   { name: "Organizations", path: "/dashboard/organizations", icon: Building2 },
//   { name: "Services", path: "/dashboard/services", icon: Briefcase },
//   { name: "Availability", path: "/dashboard/availability", icon: Calendar },
//   { name: "Bookings", path: "/dashboard/bookings", icon: BookOpen },
//   { name: "Integrations", path: "/dashboard/integrations", icon: Plug },
//   { name: "Payouts", path: "/dashboard/payments", icon: Landmark },
//   { name: "Billing", path: "/dashboard/billing", icon: ReceiptText },
// ];

// const Sidebar = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   return (
//     <aside
//       className={cn(
//         "relative flex flex-col border-r border-slate-100 bg-white transition-all duration-500 ease-in-out",
//         collapsed ? "w-[80px]" : "w-72",
//       )}
//     >
//       {/* Collapse Toggle - Floating Style */}
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-8 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-100 bg-white shadow-sm hover:bg-slate-50 transition-colors"
//       >
//         {collapsed ? (
//           <ChevronRight className="h-3 w-3" />
//         ) : (
//           <ChevronLeft className="h-3 w-3" />
//         )}
//       </button>

//       {/* Header/Label */}
//       <div
//         className={cn(
//           "px-6 pt-8 pb-4 transition-opacity duration-300",
//           collapsed ? "opacity-0" : "opacity-100",
//         )}
//       >
//         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
//           Main Menu
//         </p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 px-3">
//         {menuItems.map((item) => {
//           const isActive =
//             item.path === "/dashboard"
//               ? pathname === item.path
//               : pathname === item.path || pathname.startsWith(item.path + "/");
//           const Icon = item.icon;

//           return (
//             <button
//               key={item.name}
//               onClick={() => router.push(item.path)}
//               className={cn(
//                 "group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all duration-200 outline-none cursor-pointer",
//                 isActive
//                   ? "bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]"
//                   : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
//               )}
//             >
//               <Icon
//                 className={cn(
//                   "h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110",
//                   isActive ? "text-white" : "text-slate-400",
//                 )}
//               />

//               {!collapsed && (
//                 <span className="truncate tracking-tight animate-in fade-in slide-in-from-left-2">
//                   {item.name}
//                 </span>
//               )}

//               {/* Tooltip for collapsed state */}
//               {collapsed && (
//                 <div className="absolute left-14 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg whitespace-nowrap z-50">
//                   {item.name}
//                 </div>
//               )}
//             </button>
//           );
//         })}
//       </nav>

//       {/* Footer Section */}
//       <div className="mt-auto p-3 space-y-1">
//         <button
//           className={cn(
//             "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all",
//             collapsed && "justify-center",
//           )}
//         >
//           <HelpCircle className="h-5 w-5 text-slate-400" />
//           {!collapsed && <span className="tracking-tight">Support</span>}
//         </button>

//         <div className="pt-2 border-t border-slate-50">
//           <button
//             className={cn(
//               "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all",
//               collapsed && "justify-center",
//             )}
//           >
//             <User className="h-5 w-5 text-slate-400" />
//             {!collapsed && <span className="tracking-tight">Account</span>}
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

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
      {/* Sidebar Content Container */}
      <div className="flex flex-col h-full bg-white/50 border border-slate-200/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Toggle Button Container */}
        <div className="p-6 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 animate-in fade-in duration-500">
              Platform
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-all active:scale-90",
              collapsed && "mx-auto",
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Nav Items */}
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
                    ? "bg-slate-900 text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] scale-[1.02]"
                    : "text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-all duration-300",
                    isActive
                      ? "text-white rotate-0"
                      : "text-slate-400 group-hover:rotate-12 group-hover:text-slate-900",
                  )}
                />

                {!collapsed && (
                  <span className="text-sm font-bold tracking-tight whitespace-nowrap animate-in fade-in slide-in-from-left-4 duration-500">
                    {item.name}
                  </span>
                )}

                {/* Active Indicator Dot */}
                {isActive && !collapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                )}

                {/* Tooltip for Collapsed State */}
                {collapsed && (
                  <div className="absolute left-20 scale-0 group-hover:scale-100 transition-all origin-left bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-xl z-50 pointer-events-none shadow-xl">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-slate-100/50 space-y-1">
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-white transition-all group">
            <CircleHelp className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
            {!collapsed && <span className="tracking-tight">Support</span>}
          </button>
          <button className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-white transition-all group">
            <Settings className="h-5 w-5 text-slate-400 group-hover:text-slate-900" />
            {!collapsed && <span className="tracking-tight">Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
