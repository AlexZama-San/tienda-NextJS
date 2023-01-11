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
}

export const config = {
    matcher: ['/checkout/:path*']
}