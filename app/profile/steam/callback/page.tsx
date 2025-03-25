"use client";

import Wrapper from "@/components/wrapper";
import { useEffect } from "react";

export default function SteamCallback() {
  useEffect(() => {
    const url = window.location.href;

    // TODO: Include authenticated user ID in the request body
    const requestOptions: RequestInit = {
      method: "POST",
      body: JSON.stringify({ url }),
      redirect: "follow",
    };

    fetch("http://localhost:8000/link/steam/auth", requestOptions).catch(
      (error) => console.error(error),
    );
  }, []);

  return (
    <Wrapper>
      <h1>Hello World: Steam Callback</h1>
    </Wrapper>
  );
}
