import React from "react";
import DesktopSideBar from "./desktop/DesktopSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import MobileSideBar from "./mobile/MobileSideBar";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const SideBar = async ({ children }: { children: React.ReactNode }) => {
  const dbUser = await getCurrentUser();
  console.log({ DB: dbUser });
  // console.log({ DBUSER: dbUser });
  return (
    <div className="h-full w-full">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "50px",
            "--sidebar-width-mobile": "400px",
          } as React.CSSProperties
        }
      >
        <DesktopSideBar user={dbUser!} />
        <MobileSideBar />

        {children}
      </SidebarProvider>
    </div>
  );
};

export default SideBar;
