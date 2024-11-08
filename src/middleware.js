import { NextResponse } from 'next/server'
import localStorageAvailable from './utils/localStorageAvailable';
 
// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const storageAvailable = localStorageAvailable();
  const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
  console.log("accessToken middleware:" , accessToken);
  if (!accessToken) 
    return NextResponse.redirect(new URL('/auth/login/', request.url))
  return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
    matcher: [
      '/dashboard/:path*', // Protect the dashboard route and all its subroutes
      '/profile/:path*',   // Protect the profile route and all its subroutes
      '/settings/:path*',  // Add other protected routes as needed
    ],
  };