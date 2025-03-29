import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import type { Session } from "@/types/auth";

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const userService = new UserService();
  const userDetails = await userService.getUser(session.user.id);

  if (!userDetails) {
    return null;
  }

  return {
    user: userDetails,
    session,
  };
}
