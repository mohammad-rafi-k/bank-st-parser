import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    try {
        const res = NextResponse.next();
        const supabase = createMiddlewareClient({ req: request, res });

        const {
            data: { session },
        } = await supabase.auth.getSession();
        // Check if the user is authenticated
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;

        // If there's no session and the user is trying to access protected routes
        if (
            !session &&
            (request.nextUrl.pathname.startsWith('/dashboard') ||
                request.nextUrl.pathname.startsWith('/settings') ||
                request.nextUrl.pathname.startsWith('/documents'))
        ) {
            return NextResponse.redirect(new URL('/signin', baseUrl));
        }

        // If there's a session and the user is trying to access auth routes
        if (
            session &&
            (request.nextUrl.pathname.startsWith('/signin') ||
                request.nextUrl.pathname.startsWith('/signup'))
        ) {
            return NextResponse.redirect(new URL('/dashboard', baseUrl));
        }

        return res;
    } catch (error) {
        console.error('Middleware error:', error);
        // Return to home page if there's an error
        return NextResponse.redirect(new URL('/', request.url));
    }
}

export const config = {
    matcher: ['/dashboard/:path*', '/settings/:path*', '/documents/:path*', '/auth/callback'],
};
