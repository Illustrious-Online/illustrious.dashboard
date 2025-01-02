import { serve } from "https://deno.land/x/supabase_edge_serve@1.0.0/mod.ts";
import SteamAuth from "npm:node-steam-openid";
import { passwordGenerator } from "https://deno.land/x/password_generator/mod.ts";
import { createClient } from "jsr:@supabase/supabase-js";
import { corsHeaders } from '../_shared/cors.ts'

// Supabase credentials
const SUPABASE_ID = Deno.env.get('IDENTIFIER')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const STEAM_API_KEY = Deno.env.get('STEAM_API_KEY')!;
const STEAM_DOMAIN = Deno.env.get('STEAM_DOMAIN')!;

console.log("INITIALIZING STEAM AUTH FUNCTION");

// Initialize Supabase client (for managing users)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const steam = new SteamAuth({
  realm: `https://${SUPABASE_ID}.supabase.co`,
  returnUrl: `https://${SUPABASE_ID}.supabase.co/functions/v1/steam-auth/callback`,
  apiKey: STEAM_API_KEY,
});

// Create the Steam authentication URL
async function createAuthUrl() {
  return steam.getRedirectUrl();
}

// Callback handler after Steam authentication
async function handleCallback(req: Request) {
  console.log('HANDLE CALLBACK');
  const url = new URL(req.url);
  const { code } = Object.fromEntries(url.searchParams);

  if (!code) {
    return new Response('Error: Missing authorization code', { status: 400 });
  }

  try {
    // Exchange the code for an OpenID token
    const tokenSet = await steam.getToken(code);
    const steamId = tokenSet.id; // Steam ID from the token

    // Check if the user exists in Supabase or create a new one
    const { data: existingUser, error: userError } = await supabase.auth.api.getUserById(steamId);

    if (userError || !existingUser) {
      // If no user exists, create a new one
      const { data: newUser, error: newUserError } = await supabase.auth.api.createUser({
        email: `${steamId}@steam.com`, // Create a unique email with Steam ID
        password: passwordGenerator('A0', 16), // Use a random password for user creation
        user_metadata: { steamId },
      });

      if (newUserError) {
        return new Response('Failed to create user', { status: 500 });
      }

      // Log the user in after creation
      const { session, error: loginError } = await supabase.auth.api.setAuthCookie(req, newUser.id);

      if (loginError) {
        return new Response('Authentication error', { status: 500 });
      }

      return new Response(JSON.stringify({ message: 'User created and authenticated', session }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // If the user exists, log them in
    const { session, error: loginError } = await supabase.auth.api.setAuthCookie(req, existingUser.id);

    if (loginError) {
      return new Response('Authentication error', { status: 500 });
    }

    return new Response(JSON.stringify({ message: 'User authenticated', session }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling callback:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// Main function to handle Steam authentication
serve(async (req: Request) => {
  const url = new URL(req.url);
  console.log('url', url);
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (url.pathname === '/steam-auth') {
    // Redirect the user to Steam for authentication
    const authUrl = await createAuthUrl();
    console.log('auth url', authUrl);
    // return new Response(JSON.stringify({ url: authUrl }), {
    //   headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    //   status: 200,
    // });
    return new Response(null, { status: 302, headers: {
      "Location": authUrl,
      ...corsHeaders
    }});
  } else if (url.pathname === '/steam-auth/callback') {
    // Handle the callback from Steam
    return await handleCallback(req);
  }

  return new Response('Not found', {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 404,
  });
});
