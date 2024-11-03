"use server";
// import NextAuth, { AuthOptions } from "next-auth";
// import bcrypt from "bcryptjs";
// import CredentialsProvider from "next-auth/providers/credentials";
// import Github from "next-auth/providers/github";
// import Google from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";

// import prisma from "@/app/libs/prismadb";

import { handlers } from "@/auth";
export const { GET, POST } = handlers;
