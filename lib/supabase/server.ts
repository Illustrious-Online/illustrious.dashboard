import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    throw new Error("Missing Supabase environment variables");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookies: { name: string; value: string; options?: CookieOptions }[]) {
          for (const { name, value, options } of cookies) {
            cookieStore.set({ name, value, ...options });
          }
        },
      },
    }
  )
}