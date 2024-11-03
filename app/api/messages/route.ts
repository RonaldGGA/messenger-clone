"use server";

import getConversationById from "@/app/actions/getConversationById";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { message, image = null, conversationId } = body;
    console.log(image);
    const currentUser = await getCurrentUser();
    if (!currentUser?.email || !currentUser?.id) {
      return NextResponse.json(
        { message: "UNAUTHORIZED", success: false, data: null },
        { status: 401 }
      );
    }

    const conversation = await getConversationById(conversationId);
    if (!conversation?.id) {
      return NextResponse.json({
        message: "UNAUTHORIZED, CONVERSATION INVALID",
        success: false,
        data: null,
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seen: true,
        sender: true,
      },
    });

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seen: true,
          },
        },
      },
    });
    //this part is used for the messages
    try {
      await pusherServer.trigger(conversationId, "messages:new", newMessage);
      const lastMessage =
        updatedConversation.messages[updatedConversation.messages.length - 1];
      //this part is used for the sidebar
      updatedConversation.users.map((user) => {
        pusherServer.trigger(user.email!, "conversation:update", {
          id: conversationId,
          messages: [lastMessage],
        });
      });
    } catch (error) {
      console.log({ ERRORRRRR: error });
    }
    return NextResponse.json(
      { data: newMessage, success: true, message: "Message sent" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
      return NextResponse.json(
        {
          message: "SOMETHING HAPPENED",
          success: false,
          data: null,
          error: error.message,
        },
        { status: 505 }
      );
    }
    return NextResponse.json(
      {
        message: "SOMETHING HAPPENED",
        success: false,
        data: null,
      },
      { status: 505 }
    );
  }
};
