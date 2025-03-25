import type { Session } from '@/types/auth'
import { createClient } from '@/lib/supabase/server'
import { UserService } from '@/services/userService'

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return null
  }
  
  const userService = new UserService()
  const userDetails = await userService.getUserById(session.user.id)

  if (!userDetails) {
    return null
  }

  return {
    user: userDetails,
    accessToken: session.access_token
  }
}