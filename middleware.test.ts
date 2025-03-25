import { describe, it, expect, vi, type Mock } from 'vitest'
import { type NextRequest, NextResponse } from 'next/server'
import { middleware } from './middleware'
import { createClient } from '@/lib/supabase/server'

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}))

describe('middleware', () => {
    it('should allow requests to public paths', () => {
        const request = {
            nextUrl: { pathname: '/login' },
        } as unknown as NextRequest

        const response = middleware(request)
        expect(response).toEqual(NextResponse.next())
    })

    it('should allow requests to public file extensions', () => {
        const request = {
            nextUrl: { pathname: '/image.jpg' },
        } as unknown as NextRequest

        const response = middleware(request)
        expect(response).toEqual(NextResponse.next())
    })

    it('should redirect unauthenticated users to the auth page', async () => {
        const mockGetSession = vi.fn().mockResolvedValue({ data: { session: null } })
        ;(createClient as Mock).mockResolvedValue({
            auth: { getSession: mockGetSession },
        })

        const request = {
            nextUrl: { pathname: '/dashboard', search: '' },
            url: 'http://localhost/dashboard',
        } as unknown as NextRequest

        const response = await middleware(request)
        expect(response).toEqual(
            NextResponse.redirect(new URL('/login?returnUrl=%2Fdashboard', request.url))
        )
    })

    it('should allow authenticated users to proceed', async () => {
        const mockGetSession = vi.fn().mockResolvedValue({ data: { session: {} } })
        ;(createClient as Mock).mockResolvedValue({
            auth: { getSession: mockGetSession },
        })

        const request = {
            nextUrl: { pathname: '/dashboard', search: '' },
        } as unknown as NextRequest

        const response = await middleware(request)
        expect(response).toEqual(NextResponse.next())
    })
})