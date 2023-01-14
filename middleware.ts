import {NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {

    if(req.nextUrl.pathname.startsWith('/checkout')){
        const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || '' })
        if (session) {
            return NextResponse.next()
        }else{
            const {protocol, host, pathname } = req.nextUrl
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }
    }
    if(req.nextUrl.pathname.startsWith('/admin')){
        const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || '' })
        if (session) {
            const validRoles = ['admin','SU','SEO']
            if (validRoles.includes(session.user.role)) {
                return NextResponse.next()
            }
        }else{
            const {protocol, host, pathname } = req.nextUrl
            return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`)
        }
    }
    if(req.nextUrl.pathname.startsWith('/api/admin')){
        const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || '' })
        if (session) {
            const validRoles = ['admin','SU','SEO']
            if (validRoles.includes(session.user.role)) {
                return NextResponse.next()
            }
        }
        return new Response( JSON.stringify({message: 'not authorized'}), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }
}

export const config = {
    matcher: ['/checkout/:path*' , '/admin/:path*', '/api/admin/:path*']
}