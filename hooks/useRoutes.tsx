"use client";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import useConversations from "./useConversation";
import { HiChat, HiLogout, HiUsers } from "react-icons/hi";
import { signOut } from "next-auth/react";

// interface Route {
//   label: string;
//   href: string;
//   icon: React.ElementType; // Cambia esto según el tipo específico que necesites para tus iconos
//   active?: boolean;
//   onClick?: () => void;
// }

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversations();

  // Only dependencies that change should be considered
  const routes = useMemo(
    () => [
      {
        label: "Chats",
        href: "/conversations",
        icon: HiChat,
        active: pathname === "/conversations" || !!conversationId,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathname === "/users",
      },
      {
        label: "LogOut",
        href: "#",
        icon: HiLogout,
        onClick: () => signOut(),
      },
    ],
    [pathname, conversationId]
  ); // Only depend on necessary variables

  return routes;
};

export default useRoutes;
