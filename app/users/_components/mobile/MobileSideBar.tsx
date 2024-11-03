"use client";
import React from "react";

import useRoutes from "@/hooks/useRoutes";
import MobileSideBarItem from "./MobileSideBarItem";
import clsx from "clsx";
import useConversations from "@/hooks/useConversation";

const MobileSideBar = () => {
  const routes = useRoutes();
  const { isOpen } = useConversations();
  return (
    <div
      className={clsx(
        "md:hidden fixed bottom-0 bg-black w-full z-20 ",
        isOpen ? "hidden" : ""
      )}
    >
      <ul typeof="list" className=" flex flex-row">
        {routes.map((item) => (
          <MobileSideBarItem
            key={item.label}
            href={item.href}
            onClick={item.onClick}
            label={item.label}
            active={item.active}
            icon={item.icon}
          />
        ))}
      </ul>
    </div>
  );
};

export default MobileSideBar;
