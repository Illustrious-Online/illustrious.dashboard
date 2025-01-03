'use client';

import Wrapper from '@repo/ui/wrapper';
import { Button } from '@repo/ui/button';
import { useEffect, useState } from 'react';

export default function LinkSteam() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  const handleClick = async () => {
    setLoading(true);

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow"
    };
    
    fetch("http://localhost:8000/link/steam", requestOptions)
      .then(async (response) => {
        const json = await response.json();
        setAuthUrl(json.url);
      })
      .catch((error) => setResponseMessage("An error occurred while sending the request."));
  }

  useEffect(() => {
    window.location.href = authUrl;
  }, [authUrl])
  
  return (
    <Wrapper>
      <h1>Hello World</h1>
      <Button
          loading={loading}
          loadingText="Processing..."
          colorScheme="teal"
          onClick={handleClick}
        >
          Login with steam?
        </Button>
        {responseMessage && <p>{responseMessage}</p>}
    </Wrapper>
  );
}
