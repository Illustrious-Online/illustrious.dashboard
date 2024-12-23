"use client";

import { signIn, signOut } from "next-auth/react";

export function SignIn() {
  return (
    <button type="button" onClick={() => signIn()}>
      signIn
    </button>
  );
}

export function SignOut() {
  return (
    <button type="button" onClick={() => signOut()}>
      signOut
    </button>
  );
}
