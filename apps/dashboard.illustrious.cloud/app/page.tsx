'use client';

import Wrapper from '@repo/ui/wrapper';
import { Button } from '@repo/ui/button';
import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleClick = async () => {
    setLoading(true);

    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14c2JxcnR2aHZjcWZkaG5panRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwODk1ODksImV4cCI6MjA1MDY2NTU4OX0.gQMabMr2ZMArqXfk9dB5DdFn4ED1-1yQAppQPNcZ6s0");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("{\"name\":\"Functions\"}", "");

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow"
    };

    fetch("https://mxsbqrtvhvcqfdhnijtq.supabase.co/functions/v1/steam-auth", requestOptions)
      .then(async (response) => {
        console.log('response?', response);
        const json = await response.json();
        window.location.href = json.url;
      })
      .then((result) => {
        console.log('result', result)
        setResponseMessage(result.message);
      })
      .catch((error) => {
        console.error('error', error)
        setResponseMessage("An error occurred while sending the request.");
      })
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
