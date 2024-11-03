"use client";
import AvatarComponent from "@/app/users/_components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { Conversation, User } from "@prisma/client";

import ProfileDrawer from "@/app/_components/ProfileDrawer";
import AvatarGroup from "@/app/_components/AvatarGroup";
import useActiveList from "@/hooks/useActiveList";
import { format } from "date-fns";

interface HeaderProps {
  conversation: Conversation & {
    users: User[];
  };
}

/**Recieves the conversation and all their params */
const Header: React.FC<HeaderProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation);
  const { members } = useActiveList();

  const isActive = members.indexOf(otherUser.email as string) !== -1;
  // console.log({ USER: otherUser });
  const statusText = useMemo(() => {
    if (conversation?.isGroup) {
      return `${conversation.users.length} members`;
    }
    return isActive ? "active" : format(otherUser.updatedAt, "pp");
  }, [conversation, otherUser.updatedAt, isActive]);

  return (
    <>
      <div className="p-2 border-b w-full border-b-1 border-gray-400 flex gap-2 items-center ">
        <Link href="/conversations">
          <HiChevronLeft
            size={40}
            className="text-gray-500 hover:text-gray-800 transition md:hidden"
          />
        </Link>
        {conversation?.isGroup ? (
          <AvatarGroup users={conversation?.users} />
        ) : (
          <AvatarComponent user={otherUser} />
        )}
        <div className="p-1">
          <p className="font-medium text-lg text-gray-800">
            {conversation?.name || otherUser?.name}
          </p>
          <div className="flex items-center ">
            <p className="text-sm text-gray-500 font-light truncate max-w-[100px]">
              {statusText}
            </p>
            {/* <span className=" text-gray-500 font-thin text-sm">
            {format(new Date(), "p")}
          </span> */}
          </div>
        </div>
        <ProfileDrawer
          conversationId={conversation?.id}
          conversation={conversation}
          otherUser={otherUser}
          statusText={statusText}
        />
      </div>
    </>
  );
};

export default Header;
