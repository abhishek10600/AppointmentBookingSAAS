import { useTheme } from "next-themes";
import React, { useEffect } from "react";

const DashboardThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  return <>{children}</>;
};

export default DashboardThemeWrapper;
