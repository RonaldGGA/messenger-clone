"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversations = () => {
  const params = useParams();

  /**Gets the conversationId from the params, its either an empty string or and id with the type of a string */
  const conversationId = useMemo(() => {
    if (params?.conversationId) {
      return params.conversationId;
    }
    return "";
  }, [params]);
  /**Gets the conversationId as a boolean, it means, if there is a conversation happening in the params this will be true, otherwise it will be false */
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return { conversationId, isOpen };
};

export default useConversations;
