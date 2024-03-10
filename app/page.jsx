"use client";

import { useSession } from "next-auth/react";
import Login from "@components/Login";
import Game from "@components/Game";

export default function Example() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  if (isLoading) return <div>Loading...</div>; // Or any loading indicator you prefer

  return (
    <>
      {!session ? (
        // Render the Hero component if there's no session
        <Login />
      ) : (
        <Game />
      )}
    </>
  );
}
