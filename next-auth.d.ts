// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    id?: string;
    name: string;
    email: string;
    emailVerified?: string;
  }

  interface Token {
    id?: string;
  }
}
