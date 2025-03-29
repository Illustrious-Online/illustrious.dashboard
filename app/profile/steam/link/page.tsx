import Wrapper from "@/components/wrapper";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LinkSteam() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  const handleClick = async () => {
    setLoading(true);

    const requestOptions: RequestInit = {
      method: "POST",
      redirect: "follow",
    };

    fetch("http://localhost:8000/link/steam", requestOptions)
      .then(async (response) => {
        const json = await response.json();
        setAuthUrl(json.url);
      })
      .catch((error) =>
        setResponseMessage("An error occurred while sending the request."),
      );
  };

  useEffect(() => {
    router.push(authUrl);
  }, [authUrl, router]);

  return (
    <Wrapper>
      <h1>Hello World: Link Steam</h1>
      <Button
        loading={loading}
        loadingText="Processing..."
        colorScheme="teal"
        onClick={handleClick}
      >
        Login with steam
      </Button>
      {responseMessage && <p>{responseMessage}</p>}
    </Wrapper>
  );
}
