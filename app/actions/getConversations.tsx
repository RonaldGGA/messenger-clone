"use server";

import { getCurrentUser } from "./getCurrentUser";
import { prisma } from "@/lib/prismadb";
const getConversations = async () => {
  try {
    const dbUser = await getCurrentUser();
    // console.log({ DBINUSER: dbUser });
    if (!dbUser?.id || !dbUser?.email) {
      return [];
    }
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: dbUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
            sender: true,
          },
        },
      },
    });
    // console.log({ CONVERSATIONSSS: conversations });
    return conversations;
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
      return [];
    }
    console.log({ ERROR: "SOMETHING WENT WRONG" });
    return [];
  }
};

export default getConversations;
