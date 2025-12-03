import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('jwtToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login-user', request.url));
  }

  const { pathname } = request.nextUrl;

  const allowedRoutes: Record<string, string> = {
    '/student': 'Student',
    '/faculty': 'Faculty',
    '/industryexpert': 'IndustryExpert',
    '/uniadmin': 'UniversityAdmin',
  };

  try {
    // Fetch user profile information
    const profileResponse = await fetch('https://api-bridgeit-htb0fpcee0ajb7a2.westindia-01.azurewebsites.net/api/auth/authorized-user-info', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(new URL('/auth/login-user', request.url));
    }

    const { role } = await profileResponse.json();

    // Check if the user's role matches the route they are trying to access
    for (const [route, expectedRole] of Object.entries(allowedRoutes)) {
      if (pathname.startsWith(route) && role !== expectedRole) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in middleware:', error);
    return NextResponse.redirect(new URL('/auth/login-user', request.url));
  }
}

export const config = {
  matcher: ['/student/:path*', '/faculty/:path*', '/industryexpert/:path*', '/uniadmin/:path*'],
};
