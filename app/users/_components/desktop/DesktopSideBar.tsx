"use client";
import React from "react";
import { User } from "@prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import useRoutes from "@/hooks/useRoutes";
import Link from "next/link";
import AvatarComponent from "../Avatar";
import SettingsModal from "@/app/_components/SettingsModal";

type User2 = {
  name: string;
  email: string;
  id?: string;
  image?: string;
};
const DesktopSideBar = ({ user }: { user: User | User2 }) => {
  const routes = useRoutes();
  // console.log({ USERDESKTOP: user });
  return (
    <Sidebar className="hidden md:flex">
      <SidebarContent className="flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={item.active}
                    asChild
                    onClick={item.onClick}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className=" flex items-center justify-center w-full h-full relative">
            <SettingsModal>
              <AvatarComponent user={user} />
            </SettingsModal>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DesktopSideBar;
