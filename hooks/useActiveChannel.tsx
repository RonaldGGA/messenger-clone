"use client";

import { useEffect, useState } from "react";
import useActiveList from "./useActiveList";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe("presence-messenger");
      setActiveChannel(channel);
    }
    channel.bind("pusher:subscription_succeded", (members: Members) => {
      const initialMembers: string[] = [];
      //Special array, just use each
      members.each((member: Record<string, unknown>) =>
        initialMembers.push(member.id as string)
      );
      set(initialMembers);
    });

    channel.bind("pusher:member_added", (member: Record<string, unknown>) => {
      add(member.id as string);
    });
    channel.bind("pusher:member_removed", (member: Record<string, unknown>) => {
      remove(member.id as string);
    });
    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe("presence-messenger");
        setActiveChannel(null);
      }
    };
  }, [activeChannel, set, add, remove]);
};
export default useActiveChannel;
