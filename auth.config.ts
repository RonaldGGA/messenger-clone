import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { getUserByEmail } from "./app/data/user";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
export default {
  pages: {
    signIn: "/",
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }
        // console.log({ CREDENTIALS: credentials });
        const user = await getUserByEmail(credentials?.email as string);
        if (!user) {
          console.log({ ERROR: "USER NOT IN DB" });
          return null;
        }

        const matchPasswords = await bcrypt.compare(
          credentials.password as string,
          user?.hashedPassword as string
        );
        if (!matchPasswords) {
          console.log({ ERROR: "INVALID CREDENTIALS" });
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
