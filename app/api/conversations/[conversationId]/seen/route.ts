"use server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";
interface IParams {
  conversationId?: string;
}
//params goes last
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({
        message: "Unauthorized",
        success: false,
        data: [],
      });
    }

    const { conversationId } = params;

    //searches the current conversation
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
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
    if (!conversation) {
      return NextResponse.json({
        message: "Invalid id",
        success: false,
        data: [],
      });
    }

    //get the last message of the conversation

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) {
      return NextResponse.json(
        { message: "No last message found", success: true, data: conversation },
        { status: 202 }
      );
    }

    //Update seen of last message
    const updateMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        seen: true,
        sender: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    await pusherServer.trigger(
      currentUser.email as string,
      "conversation:update",
      {
        id: conversationId,
        messages: [updateMessage],
      }
    );

    //If we didnt see the message, just return the conversation
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }
    //if we saw the message , update the message with the new message
    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updateMessage
    );
    return NextResponse.json({
      message: "Updated the message",
      data: updateMessage,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error });
      return NextResponse.json({ error, message: "SOMETHING HAPPENDED" });
    }
    return NextResponse.json({ message: "SOMETHING HAPPENDED" });
  }
}
