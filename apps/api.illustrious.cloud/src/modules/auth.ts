import { jwtDecode } from "jwt-decode";
import { v4 as uuidv4 } from "uuid";

import { Context } from "elysia";
import config from "@/config";
import ConflictError from "@/domain/exceptions/ConflictError";
import UnauthorizedError from "@/domain/exceptions/UnauthorizedError";
import AuthUserInfo from "@/domain/interfaces/authUserInfo";
import Tokens from "@/domain/interfaces/tokens";
import SuccessResponse from "@/domain/types/generic/SuccessResponse";
import * as authService from "@/services/auth";
import * as userService from "@/services/user";
import { getSub } from "@/utils/extract-sub";
import axios from "axios";
import { supabaseClient } from "@/index";
import { Provider } from "@supabase/supabase-js";

export const create = async (code: string): Promise<Tokens> => {
  // Get tokens from bearer access token
  const tokens = await authService.getTokens(code);
  const { access_token, id_token, refresh_token } = tokens as Tokens;

  // Throw exception if tokens could not be retrieved
  if (!access_token || !id_token || !refresh_token) {
    throw new ConflictError("Failed to obtain all required tokens");
  }

  // Decode user information from ID token
  const userinfo = jwtDecode(id_token) as AuthUserInfo;

  try {
    // Attempt to get user using sub provided from tokens
    await userService.fetchOne({ sub: userinfo.sub });

    // Redirect if the user has been found
    return tokens;
  } catch (e) {
    // Catch exception thrown from the user fetch
    console.log("Create new User: User/Auth could not be found by sub");
  }

  // Set new UUID for authentication ID
  const authId = uuidv4();
  // Set user ID for user creation
  let userId;

  try {
    // Attempt to get user using sub provided from tokens
    const userByEmail = await userService.fetchOne({ email: userinfo.email });

    // Redirect if the user has been found
    userId = userByEmail.id;
  } catch (e) {
    // Catch exception thrown from the user fetch
    console.log("Create new User: User/Auth could not be found by email");
  }

  if (!userId) {
    // If no user is found, then create a new User with userinfo
    userId = uuidv4();

    await userService.create({
      id: userId,
      email: userinfo.email,
      firstName: userinfo.given_name ?? null,
      lastName: userinfo.family_name ?? null,
      picture: userinfo.picture ?? null,
      phone: userinfo.phone_number ?? null,
    });
  }

  // Create authentication using user & auth details
  await authService.create({
    userId,
    authId,
    sub: userinfo.sub,
  });

  // Redirect to the URL containing tokens
  return tokens;
};

export const deleteOne = async (
  context: Context,
): Promise<SuccessResponse<String>> => {
  if (!context.headers.authorization) {
    throw new UnauthorizedError("Authorization token is required!");
  }

  const sub = await getSub(context.headers.authorization);
  const { id } = context.params;
  const auth = await authService.fetchOne({ id });

  if (auth.sub !== sub) {
    throw new UnauthorizedError(
      "This user is not allowed to delete this Authentication",
    );
  }

  await authService.deleteOne(id);

  return {
    message: "Successfully deleted requested authentaction",
  };
};

////////////////////////////////////////

export const signInWithOAuth = async (authProvider: Provider) => {
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: authProvider
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const oauthCallback = async (code: string) => {
  const { data, error } = await supabaseClient.auth.exchangeCodeForSession(code);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export const signOut = async () => {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  return;
}

export const linkSteam = async (path: string): Promise<any> => {
  const supaConfig = {
    method: 'post',
    maxBodyLength: Infinity,
    headers: {
      'Authorization': `Bearer ${config.auth.edgeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    },
    url: `https://${config.auth.supabaseId}.supabase.co/functions/v1/${path}`,
    data: JSON.stringify({
      '{"name":"Functions"}': '',
    })
  };

  try {
    const response = await axios.request(supaConfig);
    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new Response('Failed to link steam account', { status: 500 });
  }
}
