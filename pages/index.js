import Head from "next/head";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { Button, Heading, Text } from "@chakra-ui/react";

export default function Home() {
  const auth = useAuth();
  return (
    <div>
      <Heading fontWeight="700">
        Welcome to <a href="https://nextjs.org">OpenTrek.IO!</a>
      </Heading>

      <div>
        {auth?.user ? (
          <div>
            <Text>Current User : <b>{auth.user.name}</b></Text>
            <Button onClick={(e) => auth.signout()}>Sign out</Button>
          </div>
        ) : (
          <Button onClick={(e) => auth.signinWithGithub()}>Sign in</Button>
        )}
      </div>
    </div>
  );
}
