"use client";
import { FullConversationType } from "@/app/types";
import { User } from "@prisma/client";
import useCurrentUser from "./useCurrentUser";
import { useMemo } from "react";

/**Used for searching the other user in a single conversation */
const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const currentUser = useCurrentUser();
  /**Searches in the conversation users, which one has a different user to the currentUser logged in, then you get them */
  const otherUsers = useMemo(() => {
    const currentUserEmail = currentUser?.email;
    const otherUser = conversation?.users?.filter(
      (user) => user.email !== currentUserEmail
    );
    return otherUser;
  }, [conversation, currentUser]);

  return otherUsers[0] || otherUsers;
};

export default useOtherUser;
