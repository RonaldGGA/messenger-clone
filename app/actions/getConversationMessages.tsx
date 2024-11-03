"use server";
import { getCurrentUser } from "./getCurrentUser";
import { prisma } from "@/lib/prismadb";
const getConversationMessages = async (conversationId: string) => {
  try {
    const dbUser = await getCurrentUser();
    if (!dbUser) {
      console.log({ ERROR: "NO USER IN DB MATCHES" });
      return [];
    }

    const messages = await prisma.message.findMany({
      where: {
        conversationId,
      },
      include: {
        seen: true,
        sender: true,
      },
    });
    if (!messages) {
      console.log("NO MESSAGES FOUND");
      return [];
    }
    return messages;
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
    }
    console.log({ ERORR: "SOMETHING HAPPENED" });
    return [];
  }
};

export default getConversationMessages;
