/* eslint-disable @typescript-eslint/no-explicit-any */
import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { apiRoutes, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig);
// import { auth } from "@/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname === "/";
  const isApiRoute = nextUrl.pathname.startsWith(apiRoutes);

  if (isApiRoute) {
    return undefined;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/users", nextUrl));
    }
    return undefined;
  }

  if (!isPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(process.env.DEFAULT_REDIRECT_PAGE as string, nextUrl)
    );
  }
  return undefined;
});
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
