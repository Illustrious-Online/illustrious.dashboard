'use client';

import Wrapper from '@repo/ui/wrapper';
import { Button } from '@repo/ui/button';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow"
    };
    
    fetch("http://localhost:8000/link/steam", requestOptions)
      .then(async (response) => {
        const json = await response.json();
        window.location.href = json.url;
      })
      .catch((error) => setResponseMessage("An error occurred while sending the request."))
      .finally(() => setLoading(false));
  }
  
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
