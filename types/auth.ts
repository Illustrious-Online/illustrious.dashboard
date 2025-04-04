import type { Session as SupaSession } from "@supabase/supabase-js";

export interface UserDetails {
  id: string;
  identifier: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  role: string;
  superAdmin: boolean;
  managed?: boolean;
  passwordReset?: boolean;
  // Add any other user fields you need
}

export interface Session {
  user: UserDetails;
  session: SupaSession;
}
