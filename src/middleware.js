import { NextResponse } from 'next/server'
import { getCookie, getCookies } from 'cookies-next'
import { getSession, signOut } from 'next-auth/react'
import { verifyAuthToken } from './lib/verifyAuthToken'
import { URI } from './helpers/urls'

// This function can be marked `async` if using `await` inside
export default async function middleware(req) {
    const response = NextResponse.next()
    const requestForNextAuth = {
        headers: {
            cookie: req.headers.get('cookie'),
        },
    }
    const session = await getSession({ req: requestForNextAuth })

    if (session) {
        const token = session?.accessToken
        const verifiedToken =
            token &&
            (await verifyAuthToken(`${token}`).catch(err => {
                return false
            }))
        if (!verifiedToken) {
            return NextResponse.redirect(
                new URL(`/${URI.SESSION_EXPIRE}`, req.url),
            )
        }

        if (
            !req.nextUrl.pathname.startsWith(`/${URI.VERIFY_EMAIL}`) &&
            ['', null, undefined].includes(session?.user?.email_verified_at)
        ) {
            return NextResponse.redirect(
                new URL(`/${URI.VERIFY_EMAIL}`, req.url),
            )
        } else if (
            req.nextUrl.pathname.startsWith(`/${URI.VERIFY_EMAIL}`) &&
            !['', null, undefined].includes(session?.user?.email_verified_at)
        ) {
            return NextResponse.redirect(new URL(`/${URI.DASHBOARD}`, req.url))
        }
        return response
    } else {
        return NextResponse.redirect(new URL(`/${URI.LOGIN}`, req.url))
    }
}

export const config = {
    matcher: [
        '/verify-email/:path*',
        '/dashboard/:path*',
        '/user-profile/:path*',
    ],
}
