// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    // Read cookies from the request header
    console.log("Middleware: Checking authentication via cookies ...");

    const cookieHeader = request.headers.get("cookie") || "";
    const hasToken = cookieHeader.includes("accessToken=");
    const pathname = request.nextUrl.pathname;
    const isAuthPage = pathname.startsWith("/signin");

    // Redirect to login if no token on protected pages
    if (!hasToken && !isAuthPage) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    // Redirect to home if already logged in and visiting login page
    if (hasToken && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply middleware to all pages except Next.js internals, API routes, and static assets
        "/((?!_next|favicon.ico|api|images|fonts|icons).*)",
    ],
};
