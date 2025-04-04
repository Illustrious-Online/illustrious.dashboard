import { createServerSupabaseClient } from "@/lib/supabase/server";
import { UserService } from "@/services/user-service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      // Check if the user exists in your database
      const userService = new UserService();
      const userExists = await userService.getUser(data.session.user.id);

      if (!userExists) {
        // Create user in your database via Elysia API
        await userService.createUser({
          id: data.session.user.id,
          email: data.session.user.email || "",
          avatarUrl: data.session.user.user_metadata.avatar_url,
          firstName: data.session.user.user_metadata.first_name,
          lastName: data.session.user.user_metadata.last_name,
        });
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL("/", requestUrl.origin));
}
