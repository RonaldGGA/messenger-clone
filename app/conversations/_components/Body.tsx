"use client";

import { FullMessageType } from "@/app/types";
import useConversations from "@/hooks/useConversation";
import React, { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  //Used to go to the last message once is sended a new message in the body
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversations();

  //Every time we are in the body page we will get if the messages are seen or not
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId as string);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`).catch((error) => {
        console.error("Error marking conversation as seen:", error);
      });
      setMessages((current) => {
        //searching if the message is already there or not, to not duplicate it
        //find is the same find, but simpler from lodash
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message];
      });
      bottomRef?.current?.scrollIntoView();
    };
    //En el array de mensajes, buscas el mensaje que se supone que se vio y lo cambias por ese mismo mensaje pero con la propiedad seen cambiada para que el user que lo vea se agregue a ese array
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId as string);
      pusherClient.unbind("messages:new", messageHandler);

      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId, messages]);

  return (
    <div className="flex-1  overflow-y-scroll ">
      {messages?.map((message, i) => (
        <MessageBox
          key={message.id}
          isLast={i === messages.length - 1}
          message={message}
        />
      ))}
      <div ref={bottomRef} className="" />
    </div>
  );
};

export default Body;
