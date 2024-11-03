"use client";

import { FullConversationType } from "@/app/types";
import React from "react";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import AvatarComponent from "@/app/users/_components/Avatar";
import useOtherUser from "@/hooks/useOtherUser";
import clsx from "clsx";
import useCurrentUser from "@/hooks/useCurrentUser";
import AvatarGroup from "@/app/_components/AvatarGroup";
const ConversationBox = ({
  selected,
  data,
}: {
  selected: boolean;
  data: FullConversationType;
}) => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  // console.log({ DATA: data });
  const handleClick = useCallback(() => {
    router.push(`/conversations/${data?.id}`);
  }, [data?.id, router]);
  const otherUser = useOtherUser(data);

  const lastMessage = useMemo(() => {
    console.log("RERENDERED");
    const messages = data?.messages || [];
    return messages[messages.length - 1];
  }, [data?.messages]);

  const userEmail = useMemo(() => currentUser?.email, [currentUser]);

  /**Validates if the last message has been seen by the currentUser or not */
  const lastMessageSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage?.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "send an image";
    }
    if (lastMessage?.body) {
      return lastMessage.body;
    }
    return "New conversation started";
  }, [lastMessage]);
  return (
    <div onClick={handleClick}>
      <div
        className={clsx(
          `flex w-full justify-between items-center gap-2 p-3 mb-1 hover:bg-gray-100 cursor-pointer `,
          selected ? "bg-gray-200" : ""
        )}
      >
        <div className="flex  items-center gap-2">
          {data?.isGroup ? (
            <AvatarGroup users={data.users} />
          ) : (
            <AvatarComponent user={otherUser} />
          )}
          <div className="flex flex-col gap-0.5 ">
            <span className="flex-1 text-sm">
              {data?.name || otherUser.name}
            </span>
            <span
              className={clsx(
                `
            text-sm
            truncate
            tracking-tight
            `,
                lastMessageSeen ? "text-gray-900 font-medium" : "text-gray-400"
              )}
            >
              {lastMessageText}
            </span>
          </div>
          {/* {lastMessage?.createdAt && (
          <div>{format(new Date(lastMessage.createdAt), "p")}</div>
        )} */}
        </div>
        <div className="text-gray-400 text-xs flex mb-5 font-light ">
          {format(new Date(), "p")}
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
