"use server";

import { getCurrentUser } from "./getCurrentUser";
import { prisma } from "@/lib/prismadb";
const getConversationById = async (id: string) => {
  try {
    const dbUser = await getCurrentUser();

    if (!dbUser) {
      console.log({ ERROR: "NO USER IN THE DB" });
      return null;
    }
    const conversation = await prisma.conversation.findMany({
      where: { id },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seen: true,
          },
        },
      },
    });
    if (!conversation) {
      console.log({ ERROR: "CONVERSATION NOT FOUND" });
      return null;
    }
    return conversation[0];
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
    }
    console.log({ ERORR: "SOMETHING HAPPENED" });
    return null;
  }
};

export default getConversationById;
