import React from "react";
import Header from "../_components/Header";
import getConversationById from "@/app/actions/getConversationById";
import EmptySpace from "@/app/_components/EmptySpace";
import getConversationMessages from "@/app/actions/getConversationMessages";
import Body from "../_components/Body";
import MessagesForm from "../_components/Form";

interface IParams {
  conversationId: string;
}

const ConversationId = async ({ params }: { params: IParams }) => {
  // console.log({ PARAMS: params });
  if (
    params.conversationId.length !== 24 ||
    isNaN(parseInt(params.conversationId, 10))
  ) {
    return;
  }
  const conversation = await getConversationById(params.conversationId);
  const messages = await getConversationMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="flex-1 w-full  h-full">
        <EmptySpace />
      </div>
    );
  }

  return (
    <div className="md:pl-80 w-full flex flex-col max-h-screen">
      <Header conversation={conversation} />
      <Body initialMessages={messages} />
      <MessagesForm />
    </div>
  );
};

export default ConversationId;
