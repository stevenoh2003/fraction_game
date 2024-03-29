// Inside your Example component file

"use client";

import React, { useState } from "react";
import Login from "@components/Login";
import Game from "@components/Game";

export default function Example() {
  const [nicknameEntered, setNicknameEntered] = useState(false); // Add state to track nickname entry
  const [nickname, setNickname] = useState(""); // Add state to hold the nickname

  const handleNicknameSubmit = (nickname) => {
    setNicknameEntered(true); // This will be called from Login component once the nickname is submitted
    setNickname(nickname); // Update the nickname state
  };


  // if (isLoading) return <div>Loading...</div>; // Loading indicator

  if (!nicknameEntered) {
    // If there's no session and nickname hasn't been entered, show the Login
    return <Login onNicknameSubmit={handleNicknameSubmit} />;
  } else {
    // If there's a session or a nickname has been entered, show the Game
    return <Game nickname={nickname} />;
  }
}
