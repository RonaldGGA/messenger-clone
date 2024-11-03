"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prismadb";
export const getCurrentUser = async () => {
  try {
    const session = await auth();
    // console.log({ SESSION: session });
    if (!session?.user) {
      console.log({ ERROR: "USER NOT LOGGED IN" });
      return null;
    }
    const user = session.user;
    // console.log(user);
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email as string },
    });
    if (!dbUser) {
      console.log({ ERROR: "USER DOESNT EXISTS IN DB" });
      return null;
    }
    return dbUser;
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
      return null;
    }
    throw new Error("something happened");
  }
};
