"user client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

const Login = ( props ) => {
  // const { data: session } = useSession();
  const [nickname, setNickname] = useState("");
    const [leaderboard, setLeaderboard] = useState([]);


      useEffect(() => {
        const fetchLeaderboard = async () => {
          try {
            const response = await fetch("/api/scores/leaderboard");
            if (!response.ok) throw new Error("Failed to fetch leaderboard");
            const data = await response.json();
            setLeaderboard(data.slice(0, 10)); // Assuming the API returns sorted data; otherwise, sort it here
          } catch (error) {
            console.error("Failed to fetch leaderboard:", error);
          }
        };

        fetchLeaderboard();
      }, []);

  const handleNicknameSubmit = (event) => {
    event.preventDefault();
    console.log(nickname); // Demonstrative logging
    props.onNicknameSubmit(nickname); // Pass the nickname to the callback
    console.log(props);
  };
  return (
    <div className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col justify-center lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <h2 className="text-base font-semibold leading-7 text-indigo-600">
                Sharpen Your Mind
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Math Mastery Through Play
              </p>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Dive into a world where fractions become fun. Our engaging game
                is designed to strengthen your math skills, boost cognitive
                abilities, and make learning an adventure.
              </p>
              <div className="mt-10">
                {/* {!session ? (
                  <form
                    onSubmit={handleNicknameSubmit}
                    className="flex items-center justify-center gap-x-6"
                  >
                    <input
                      type="text"
                      placeholder="Enter your nickname"
                      className="rounded-md border border-gray-300 p-2.5 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />

                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Enter
                    </button>
                  </form>
                ) : (
                  <span className="text-sm font-semibold text-gray-900">
                    Welcome back!
                  </span>
                )} */}
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-semibold">Top Players</h3>
                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow">
                  <ul className="divide-y divide-gray-200">
                    {leaderboard.slice(0, 5).map((entry, index) => (
                      <li key={index} className="flex justify-between py-2">
                        <span className="text-sm">{entry.username}</span>
                        <span className="text-sm font-bold">{entry.score}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <img
            src="/assets/images/box.png"
            alt="Product screenshot"
            className="w-[24rem] max-w-none rounded-xl sm:w-[28.5rem] md:-ml-4 lg:-ml-0 -mt-30"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
