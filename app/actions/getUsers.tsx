"use server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "./getCurrentUser";
const getUsers = async () => {
  const dbUser = await getCurrentUser();
  if (!dbUser?.email) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          email: dbUser.email,
        },
      },
    });
    return users;
  } catch (error) {
    if (error instanceof Error) {
      console.log({ ERROR: error.message });
      return [];
    }
    return [];
  }
};

export default getUsers;
