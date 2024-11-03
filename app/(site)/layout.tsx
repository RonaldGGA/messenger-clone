import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import React, { Suspense } from "react";
import { Toaster } from "sonner";

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout = async ({ children }: SiteLayoutProps) => {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Suspense fallback={"@/app/conversations/loading"}>
        <Toaster />
        {children}
      </Suspense>
    </SessionProvider>
  );
};

export default SiteLayout;
