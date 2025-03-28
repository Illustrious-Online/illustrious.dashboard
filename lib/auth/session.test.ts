import { describe, it, expect, vi } from 'vitest'
import { getSession } from './session'
import { createClient } from '@/lib/supabase/server'
import { UserService } from '@/services/userService'
import type { SupabaseClient } from '@supabase/supabase-js'

vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn()
}))

vi.mock('@/services/userService', () => ({
    UserService: vi.fn().mockImplementation(() => ({
        getUserById: vi.fn()
    }))
}))

describe('getSession', () => {
    it('should return null if no session exists', async () => {
        const mockSupabase = {
            auth: {
                getSession: vi.fn().mockResolvedValue({ data: { session: null } })
            }
        }
        vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient)

        const result = await getSession()
        expect(result).toBeNull()
    })

    it('should return null if user details are not found', async () => {
        const mockSupabase = {
            auth: {
                getSession: vi.fn().mockResolvedValue({
                    data: { session: { user: { id: 'user-id' }, access_token: 'token' } }
                })
            }
        }
        vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient)

        const mockUserService = new UserService()
        vi.mocked(mockUserService.getUserById).mockResolvedValue(null)

        const result = await getSession()
        expect(result).toBeNull()
    })

    it('should return session with user details and access token if session and user details exist', async () => {
        const mockSupabase = {
            auth: {
                getSession: vi.fn().mockResolvedValue({
                    data: { session: { user: { id: 'user-id' }, access_token: 'token' } }
                })
            }
        }
        vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as SupabaseClient)

        const mockUserDetails = { id: 'user-id', name: 'Test User', email: 'test@example.com', role: 'user' }
        const mockUserService = new UserService()
        vi.spyOn(mockUserService, 'getUserById')
            .mockResolvedValue(mockUserDetails) // Mock the user details
        vi.mocked(UserService).mockImplementation(() => mockUserService)

        const result = await getSession()
        expect(result).toEqual({
            user: mockUserDetails,
            accessToken: 'token'
        })
    })
})