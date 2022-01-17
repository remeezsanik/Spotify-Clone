import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';

export async function middleware(req: any) {
    const token = await getToken({ req, secret: process.env.JWT_SECRET })
    const { pathname } = req.nextUrl;
    // console.log("here is your token: ", token);


    //Allow access if there is valid token
    if (pathname.includes('/api/auth') || token) {
        return NextResponse.next();
    }
    // Redirects if no token or not in the login page

    if (!token && pathname !== '/login') {
        return NextResponse.redirect("/login");
    }
}
