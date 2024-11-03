"use server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import getConversationById from "@/app/actions/getConversationById";
import { pusherServer } from "@/lib/pusher";

interface IParams {
  conversationId: string;
}

export async function DELETE({ params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
          data: [],
        },
        {
          status: 401,
        }
      );
    }
    const { conversationId } = params;

    if (!conversationId) {
      return NextResponse.json(
        {
          message: "ID MISSING",
          success: false,
          data: [],
        },
        {
          status: 400,
        }
      );
    }
    //We need to get this because we will use it with pusher
    const existingConversation = await getConversationById(conversationId);
    if (!existingConversation) {
      return NextResponse.json(
        {
          message: "Conversation does not exist",
          success: false,
          data: [],
        },
        {
          status: 404,
        }
      );
    }
    await prisma.message.deleteMany({
      where: {
        conversationId, // Use the actual conversation ID
      },
    });
    const deletedConversation = await prisma.conversation.delete({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:remove",
          existingConversation
        );
      }
    });
    return NextResponse.json(
      {
        message: "Conversation deleted",
        data: deletedConversation,
        success: true,
      },
      { status: 204 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error });
      return NextResponse.json(
        { error, message: "SOMETHING HAPPENDED" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "SOMETHING HAPPENDED" },
      { status: 500 }
    );
  }
}
