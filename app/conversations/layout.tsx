import React from "react";
import getConversations from "../actions/getConversations";
import ConversationList from "./_components/ConversationList";
import SideBar from "../users/_components/SideBar";
import { SessionProvider } from "next-auth/react";
import getUsers from "../actions/getUsers";

const ConversationsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();
  const users = await getUsers();
  return (
    <SessionProvider>
      <div className="flex flex-row w-full">
        <SideBar>
          <ConversationList users={users} initialItems={conversations} />
          {children}
        </SideBar>
      </div>
    </SessionProvider>
  );
};

export default ConversationsLayout;
