// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // console.log("request:" , request);
  // Retrieve the token from cookies
  const token = request.cookies.get('accessToken');
  // Check if the token is valid
  if (!token) {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Allow the request to proceed cv    
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: [
    '/dashboard/:path*', // Protect the dashboard route and all its subroutes
    '/profile/:path*',   // Protect the profile route and all its subroutes
    '/settings/:path*',  // Add other protected routes as needed
  ],
};