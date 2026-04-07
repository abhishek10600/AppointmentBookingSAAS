// "use client";

// import Navbar from "@/components/general/Navbar";
// import Sidebar from "@/components/general/Sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useAppDispatch } from "@/redux/hooks";
// import { fetchOrganizations } from "@/redux/slices/organizationSlice";
// import React, { useEffect } from "react";

// const layout = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(fetchOrganizations());
//   }, [dispatch]);

//   return (
//     <ProtectedRoute>
//       <div className="h-screen flex flex-col">
//         <Navbar />
//         <div className="flex flex-1 overflow-hidden">
//           <Sidebar />
//           <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
//             {children}
//           </main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default layout;

// "use client";

// import Navbar from "@/components/general/Navbar";
// import Sidebar from "@/components/general/Sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import { useAppDispatch } from "@/redux/hooks";
// import { fetchOrganizations } from "@/redux/slices/organizationSlice";
// import React, { useEffect } from "react";

// const Layout = ({ children }: { children: React.ReactNode }) => {
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     dispatch(fetchOrganizations());
//   }, [dispatch]);

//   return (
//     <ProtectedRoute>
//       <div className="flex flex-col h-screen bg-[#FDFDFF]">
//         {/* Navbar stays sticky at top */}
//         <Navbar />

//         <div className="flex flex-1 overflow-hidden">
//           {/* Sidebar sits under Navbar */}
//           <Sidebar />

//           <main className="flex-1 overflow-y-auto px-8 py-8 relative">
//             {/* Subtle background glow to match Login/Register */}
//             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

//             <div className="relative z-10 max-w-6xl mx-auto">{children}</div>
//           </main>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default Layout;

"use client";

import Navbar from "@/components/general/Navbar";
import Sidebar from "@/components/general/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
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
      <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden">
        {/* Navbar */}
        <Navbar />

        <div className="flex flex-1 overflow-hidden pt-2 pb-6">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Workspace Area */}
          <main className="flex-1 pr-6 overflow-hidden">
            <div className="h-full w-full bg-white border border-slate-200/60 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-y-auto no-scrollbar relative">
              {/* Internal Content Padding */}
              <div className="p-8 max-w-6xl mx-auto min-h-full">
                {/* Content Header Animation Wrap */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
                  {children}
                </div>
              </div>

              {/* Decorative Blur Inside Main (Optional) */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.02] rounded-full blur-[120px] pointer-events-none" />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Layout;
