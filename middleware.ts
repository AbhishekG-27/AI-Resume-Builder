// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSessionClient } from "./lib/appwrite";

export async function middleware(request: NextRequest) {
  try {
    const user = await createSessionClient();
    if (!user) {
      // Redirect them to the login page if not authenticated
      return NextResponse.redirect(new URL("/sign-in", request.url));
    } else {
      // If the user is logged in, allow the request to proceed
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/upload-resume",
};
