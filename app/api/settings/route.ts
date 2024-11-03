import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser();
    const { name, image = "/avatar.png" } = body;
    if (name) {
      return NextResponse.json({
        message: "Invalid Name",
        data: [],
        success: false,
      });
    }
    if (!currentUser?.id) {
      return NextResponse.json({
        message: "Unauthorized, user not authenticated",
        data: [],
        success: false,
      });
    }
    const newPublicUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        image,
      },
    });
    return NextResponse.json({
      message: "User uptades succesfully",
      data: newPublicUser,
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        message: "Internal Error",
        error: error.message,
        success: false,
      });
    }
    return NextResponse.json({
      message: "Internal Error",
      success: false,
    });
  }
}
