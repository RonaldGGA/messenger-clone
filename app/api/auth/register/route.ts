"use server";
import { hashedPassword } from "@/app/utils/hashedPassword";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

export const POST = async (request: NextRequest) => {
  try {
    // Fetching and parsing the JSON body
    const body = await request.json();
    const { email, name, password } = body;

    // Validating input
    if (!email || !name || !password) {
      return NextResponse.json({
        success: false,
        message: "Invalid credentials",
        data: {},
      });
    }

    // Log input for debugging
    // console.log("Received data:", { email, name, password });

    // Hash the password
    const newHashedPassword = await hashedPassword(password);
    if (!newHashedPassword) {
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
        data: {},
      });
    }

    // Creating a new user using Prisma
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword: newHashedPassword,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "User successfully created",
      data: user,
    });
  } catch (error) {
    // Detailed error handling
    if (error instanceof Error) {
      console.error("Error during user registration:", error.message);
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
        error: error.message,
        data: {},
      });
    } else {
      console.error("Unexpected error:", error);
      return NextResponse.json({
        success: false,
        message: "Something went wrong",
        data: {},
      });
    }
  }
};
