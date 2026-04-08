"use client";

import DashboardThemeWrapper from "@/components/DashboardThemeWrapper";
import Navbar from "@/components/general/Navbar";
import Sidebar from "@/components/general/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAppDispatch } from "@/redux/hooks";
import { fetchOrganizations } from "@/redux/slices/organizationSlice";
import React, { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex flex-col h-screen bg-background overflow-hidden">
          {/* Navbar */}
          <Navbar />

          <div className="flex flex-1 overflow-hidden pt-2 pb-6">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Workspace */}
            <main className="flex-1 pr-6 overflow-hidden">
              <div className="h-full w-full bg-card border border-border rounded-[2.5rem] shadow-sm overflow-y-auto no-scrollbar relative">
                {/* Content */}
                <div className="p-8 max-w-6xl mx-auto min-h-full">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                    {children}
                  </div>
                </div>

                {/* Subtle Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
              </div>
            </main>
          </div>
        </div>
      </ThemeProvider>
    </ProtectedRoute>
  );
};

export default Layout;
