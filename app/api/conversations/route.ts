"use server";

import { getCurrentUser } from "@/app/actions/getCurrentUser";
import getUsers from "@/app/actions/getUsers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { pusherServer } from "@/lib/pusher";

export const POST = async (request: Request) => {
  try {
    const users = await getUsers();
    if (!users) {
      return NextResponse.json(
        { message: "No users found", success: false },
        { status: 404 }
      );
    }
    const dbUser = await getCurrentUser();

    if (!dbUser?.id || !dbUser?.email) {
      return NextResponse.json(
        { message: "Unauthorized", success: false },
        { status: 401 }
      );
    }
    const body = await request.json();
    //The userId passed here is not our userId , is the userId of the person we want to start the conversation with
    const { userId, isGroup = false, members = 0, name = undefined } = body;
    // console.log({ USERID: userId });
    if (isGroup && (members.length < 2 || !name || userId)) {
      return NextResponse.json(
        { message: "Invalid settings", success: false, data: {} },
        { status: 401 }
      );
    }
    //We dont check if there is a group created with the same people before, no needed
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              //Create objects with the schema of{id:idvalue} inside the connect array
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: dbUser.id },
            ],
          },
        },
        include: {
          //returns the actuals users. not just the ids
          users: true,
        },
      });

      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, "conversation:new", newConversation);
        }
      });
      return NextResponse.json(
        {
          message: "New group conversation created",
          success: true,
          data: newConversation,
        },
        { status: 200 }
      );
    }

    //now we check if there is a conversation created when is a 1:1 conversation
    //We use findMany because the methods inside it are just supported by the findMany call
    console.log("IM HERE 1");
    const existingConversations = await prisma.conversation.findMany({
      where: {
        //OR se utiliza para que se obtenga el objeto cuando al menos una de las condiciones es verdadera

        //Busca dentro del valor userIds el cual es un arreglo que contiene los ids involucrados en la conversacion si , sin importar el orden, estan esos 2 ids involucrados
        OR: [
          {
            userIds: {
              equals: [dbUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, dbUser.id],
            },
          },
        ],
      },
    });
    const singleConversation = existingConversations[0];
    console.log("IM HERE 2");
    if (singleConversation) {
      return NextResponse.json(
        {
          success: true,
          message: "Conversation already exists, succesfully fetched",
          data: singleConversation,
        },
        { status: 200 }
      );
    }
    const newSingleConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: dbUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    console.log("IM HERE 3");

    newSingleConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(
          user.email,
          "conversation:new",
          newSingleConversation
        );
      }
    });

    return NextResponse.json({
      message: "Conversation created",
      success: true,
      data: newSingleConversation,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: "An error ocurred",
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        message: "An error ocurred",
        success: false,
      },
      { status: 500 }
    );
  }
};
