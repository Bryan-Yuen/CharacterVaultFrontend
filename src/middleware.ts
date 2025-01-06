import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
 // Extract all URL parameters from the request
 const url = request.nextUrl;
 const searchParams = url.searchParams;

 // Create an object to hold all query parameters
 const queryParams : any= {};
 searchParams.forEach((value, key) => {
   queryParams[key] = value;
 });

 // Log the object for debugging (optional)
 console.log("Query Parameters:", queryParams);

 // Create a response object
 const response = NextResponse.next();

 // Serialize the object to JSON and store it as a cookie
 if (Object.keys(queryParams).length > 0) {
   response.cookies.set("homepage-campaign-params", JSON.stringify(queryParams), {
     path: "/",
     maxAge: 60 * 60 * 24 * 7, // 1 week
   });
 }

 return response;
}

export const config = {
  matcher: '/',
}