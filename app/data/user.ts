"use server";

import { prisma } from "@/lib/prismadb";

export const getUserByEmail = async (email: string) => {
  // console.log({ EMAIL: email });
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      console.log("USER NOT FOUND");
      return null;
    }
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
    } else {
      console.log({ ERROR: "Unknown error" });
    }
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      console.log("USER NOT FOUND");
      return null;
    }
    return user;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
      return null;
    } else {
      console.log({ ERROR: "Unknown error" });
      return null;
    }
    return null;
  }
};
