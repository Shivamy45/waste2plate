import { NextResponse } from 'next/server';

export function middleware(req) {
    const isAuthenticated=true;
    // Log the request method and URL
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    // Example: Redirect users from "/User-page" to "/user-page"
    if ( isAuthenticated ==true) {
        return NextResponse.redirect(new URL('/user-page', req.url));
    }

    // Continue to the next middleware or route
    return NextResponse.next();
}