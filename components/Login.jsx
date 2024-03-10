"use client";

import React from "react";
import { useSession, signIn } from "next-auth/react";

const Feature = () => {
  const { data: session } = useSession();

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
              <div className="mt-10 flex items-center justify-center gap-x-6">
                {!session ? (
                  <button
                    onClick={() => signIn()}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </button>
                ) : (
                  <span className="text-sm font-semibold text-gray-900">
                    Welcome back!
                  </span>
                )}
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

export default Feature;
