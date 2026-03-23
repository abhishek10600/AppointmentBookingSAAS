import Navbar from "@/components/general/Navbar";
import Sidebar from "@/components/general/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className="h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default layout;
