"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';


import Modal from "@components/Modal";
import { q1, q2, q3, q4, q5, q6, q7 } from './questions'; // Adjust the path as necessary



const questions = [
  q1[Math.floor(Math.random() * q1.length)],
  q2[Math.floor(Math.random() * q2.length)],
  q3[Math.floor(Math.random() * q3.length)],
  q4[Math.floor(Math.random() * q4.length)],
  q5[Math.floor(Math.random() * q5.length)],
  q6[Math.floor(Math.random() * q6.length)],
  q7[Math.floor(Math.random() * q7.length)],
];


const Game = ( {nickname} ) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [navigate, setNavigate] = useState(false);
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false); // State for toggling leaderboard visibility
  const [showCheckMark, setShowCheckMark] = useState(false); // State to control when to show the check mark animation

  const [timer, setTimer] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerId, setTimerId] = useState(null);
const [roundsCompleted, setRoundsCompleted] = useState(0);
const [additionalScore, setAdditionalScore] = useState(0);

  // Timer functions
  // Timer management functions
const startTimer = () => {
  let startTime = Date.now();

  const tick = () => {
    const elapsed = Date.now() - startTime;
    setTimer(Math.floor(elapsed / 1000)); // Update timer every second

    if (timerId !== null) {
      requestAnimationFrame(tick);
    }
  };

  stopTimer(); // Clear any existing timer
  setTimerId(requestAnimationFrame(tick));
};

const stopTimer = () => {
  if (timerId !== null) {
    cancelAnimationFrame(timerId);
    setTimerId(null);
  }
};


  const resetTimer = () => {
    stopTimer(); // Ensure the current timer is stopped before resetting
    setTimer(0);
    startTimer(); // Restart the timer after resetting
  };
  useEffect(() => {
    startTimer();

    // Cleanup function to clear interval when the component unmounts or question changes
    return () => stopTimer();
  }, [currentQuestionIndex]); // Add currentQuestionIndex to dependencies to reset timer on question change

  useEffect(() => {
    // Reset and restart timer when the question changes
    resetTimer();
    return () => stopTimer(); // Ensure cleanup happens on every dependency change
  }, [currentQuestionIndex]);

  // Initialize game state based on the first question
  const [targetNumerator, setTargetNumerator] = useState(
    questions[currentQuestionIndex].targetNumerator
  );
  const [targetDenominator, setTargetDenominator] = useState(
    questions[currentQuestionIndex].targetDenominator
  );
  const [userFraction, setUserFraction] = useState({
    numerator: [],
    denominator: [],
  });
  const [cards, setCards] = useState(
    questions[currentQuestionIndex].numbers.map((number) => ({
      number,
      available: true,
    }))
  );

  const toggleLeaderboardVisibility = () => {
    setIsLeaderboardVisible(!isLeaderboardVisible);
  };

  const showModal = (message, autoClose = false, navigate = false) => {
    setModalMessage(message);
    setIsModalOpen(true);

    if (autoClose) {
      setTimeout(() => {
        setIsModalOpen(false);
        if (navigate) {
          // Navigate to the homepage or another page
          // Example: router.push('/homepage');
          setNavigate(true);
        }
      }, 1000);
    }
  };

  const submitScore = async (username, score) => {
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score }),
      });
      if (!response.ok) {
        throw new Error("Score submission failed");
      }
      console.log("Score submitted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/scores/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      const data = await response.json();
      setLeaderboard(data); // Update the leaderboard state
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/scores/leaderboard");
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaderboard();
  }, [highScore]);

  useEffect(() => {
    if (navigate) {
      window.location.href = "/";
    }
  }, [navigate]);

  const [operations, setOperations] = useState(["+", "×"]);

  const onDragStart = (e, item, type) => {
    e.dataTransfer.setData("application/json", JSON.stringify({ item, type }));
  };

  const onDrop = (e, zone) => {
    e.preventDefault();
    const { item, type } = JSON.parse(
      e.dataTransfer.getData("application/json")
    );

    if (type === "number") {
      // setCards(
      //   cards.map((card) =>
      //     card.number === item ? { ...card, available: false } : card
      //   )
      // );

      // Check if the last item in the zone is a number and combine if current item is also a number
      if (
        userFraction[zone].length > 0 &&
        userFraction[zone][userFraction[zone].length - 1].type === "number" &&
        type === "number"
      ) {
        const newItem = {
          item: parseInt(
            `${userFraction[zone][userFraction[zone].length - 1].item}${item}`
          ),
          type: "number",
        };
        setUserFraction({
          ...userFraction,
          [zone]: [
            ...userFraction[zone].slice(0, userFraction[zone].length - 1),
            newItem,
          ],
        });
        return;
      }
    }

    setUserFraction({
      ...userFraction,
      [zone]: [...userFraction[zone], { item, type }],
    });
  };
  const removeFromFraction = (zone, index) => {
    const item = userFraction[zone][index];
    if (item.type === "number") {
      if (item.item.toString().length > 1) {
        // Check if the number has more than one digit
        // Split the number into its original components
        const originalNumbers = item.item.toString().split("").map(Number);
        // Update the cards to set these numbers as available again
        setCards(
          cards.map((card) =>
            originalNumbers.includes(card.number)
              ? { ...card, available: true }
              : card
          )
        );
      } else {
        // For single digit numbers, simply set them as available
        setCards(
          cards.map((card) =>
            card.number === item.item ? { ...card, available: true } : card
          )
        );
      }
    }

    // Remove the item from the userFraction
    setUserFraction({
      ...userFraction,
      [zone]: [
        ...userFraction[zone].slice(0, index),
        ...userFraction[zone].slice(index + 1),
      ],
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const computeFractionPart = (part) => {
    if (part.length === 0) return 0;
    let value = part[0].type === "number" ? part[0].item : 1;
    let operation = "+";
    for (let i = 1; i < part.length; i++) {
      if (part[i].type === "operation") {
        operation = part[i].item;
      } else {
        value = operation === "+" ? value + part[i].item : value * part[i].item;
      }
    }
    return value;
  };

  const checkFraction = () => {
    stopTimer();
    const numeratorValue = computeFractionPart(userFraction.numerator);
    const denominatorValue = computeFractionPart(userFraction.denominator);
    const userFractionValue = numeratorValue / denominatorValue;
    const targetFractionValue = targetNumerator / targetDenominator;

    if (userFractionValue === targetFractionValue) {
      const baseScore = 50; // Base score for a correct answer
      setTimeElapsed(timer)
      const timePenalty = timeElapsed * 2; // Penalty for time taken
      const scoreMultiplier = 1 + roundsCompleted * 0.3; // 10% more points for each round completed
      const potentialScore = Math.max(0, baseScore - timePenalty); // Ensure score doesn't go negative
      const roundScore = Math.floor(Math.max(10, potentialScore * scoreMultiplier)); // Ensure minimum score is 10

      showModal(`Success! You got ${roundScore} points`, true);

      setHighScore((prevScore) => prevScore + roundScore);
      setRoundsCompleted((prevRounds) => prevRounds + 1);

      // Load the next question or cycle back to the first
      const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      setCurrentQuestionIndex(nextQuestionIndex);
      resetTimer();

      // Reset game state for the next question
      setTargetNumerator(questions[nextQuestionIndex].targetNumerator);
      setTargetDenominator(questions[nextQuestionIndex].targetDenominator);
      setUserFraction({ numerator: [], denominator: [] });
      setCards(
        questions[nextQuestionIndex].numbers.map((number) => ({
          number,
          available: true,
        }))
      );
    } else {
      submitScore(nickname, highScore);
      showModal("Game over!", true, true);
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-100">
      <div className="z-1 flex flex-col lg:flex-row bg-white shadow-lg rounded-lg overflow-hidden w-full lg:w-2/4 lg:mr-10 h-screen">
        {showCheckMark && (
          <div className="fixed inset-0 flex items-center justify-center z-990 bg-black bg-opacity-50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 text-green-500 animate-checkmark"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17.707 5.293a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L8 13.586l8.293-8.293a1 1 0 0 1 1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
        {/* Main game area */}
        <div className="flex flex-col justify-center items-center p-5 flex-auto h-full">
          <div id="game-rules" className="mb-5">
            <div
              className={`fixed bg-black bg-opacity-50 transition-opacity ${
                isLeaderboardVisible
                  ? "opacity-100 visible"
                  : "opacity-0 invisible"
              }`}
              onClick={toggleLeaderboardVisibility}
            ></div>
            <div className="text-lg font-bold">Welcome! {nickname}</div>
            <div className="text-xl font-bold mb-4">
              High Score: {highScore} | Time: {timer}s
            </div>
          </div>

          <div className="flex justify-center items-center mb-5">
            <div className="inline-flex flex-col items-center bg-blue-100 p-4 rounded mr-2">
              <div className="text-center font-bold">{targetNumerator}</div>
              <div className="w-full border-t border-gray-400"></div>
              <div className="text-center font-bold">{targetDenominator}</div>
            </div>
          </div>

          <div id="workspace-container" className="mb-10 ml-20 mr-20">
            {/* Numerator */}
            <div
              id="numerator"
              className="dropzone bg-gray-100 p-4 rounded mb-2 h-20"
              style={{ width: "200px" }} // Set a fixed width for the numerator field
              onDrop={(e) => onDrop(e, "numerator")}
              onDragOver={onDragOver}
            >
              {userFraction.numerator.map((item, index) => (
                <span
                  key={index}
                  className={`inline-block ${
                    item.type === "number"
                      ? "bg-gray-300"
                      : "bg-gray-500 text-white"
                  } rounded p-2 m-1 cursor-pointer`}
                  onClick={() => removeFromFraction("numerator", index)}
                >
                  {item.item}
                </span>
              ))}
            </div>
            {/* Denominator */}
            <div
              id="denominator"
              className="dropzone bg-gray-100 p-4 rounded h-20"
              style={{ width: "200px" }} // Set a fixed width for the denominator field
              onDrop={(e) => onDrop(e, "denominator")}
              onDragOver={onDragOver}
            >
              {userFraction.denominator.map((item, index) => (
                <span
                  key={index}
                  className={`inline-block ${
                    item.type === "number"
                      ? "bg-gray-300"
                      : "bg-gray-500 text-white"
                  } rounded p-2 m-1 cursor-pointer`}
                  onClick={() => removeFromFraction("denominator", index)}
                >
                  {item.item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center">
            {cards.map((card, index) => (
              <div
                key={`card-${index}`}
                className={`card bg-gray-200 m-1 p-2 rounded ${
                  !card.available && "opacity-50 cursor-not-allowed"
                }`}
                draggable={card.available}
                onDragStart={(e) => onDragStart(e, card.number, "number")}
              >
                {card.number}
              </div>
            ))}
            {operations.map((operation, index) => (
              <div
                key={`operation-${index}`}
                className="operation bg-gray-200 m-1 p-2 rounded"
                draggable="true"
                onDragStart={(e) => onDragStart(e, operation, "operation")}
              >
                {operation}
              </div>
            ))}
          </div>

          <div className="flex justify-center mb-2">
            <button
              onClick={checkFraction}
              className="bg-blue-500 text-white p-2 rounded m-5"
            >
              Check Fraction
            </button>
            {/* <button
             onClick={() => {}}
             className="bg-blue-500 text-white p-2 rounded m-5"
           >
             Generate New Fraction
           </button> */}
          </div>
        </div>
        <button
          className={`absolute top-1/2 right-8 transform -translate-y-1/2 z-10 lg:hidden bg-blue-500 text-white p-2 rounded ${
            isLeaderboardVisible ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={toggleLeaderboardVisibility}
          style={{ opacity: 0.8 }} // Adjust the opacity as needed
        >
          {isLeaderboardVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block -mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline-block -mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar for high score and global ranking */}
      <div
        className={`z-20 fixed top-0 right-0 w-64 h-full p-5 bg-white shadow-lg rounded-lg transition-transform duration-300 ${
          isLeaderboardVisible ? "translate-x-[-20px]" : "translate-x-full"
        } lg:translate-x-0 lg:relative mt-5`}
        style={{ height: "calc(100vh - 50px)" }}
      >
        <div className="mb-4"></div>
        <div className="bg-gray-100 p-4 rounded-lg shadow mb-4">
          <div className="font-bold text-lg">Game Rules</div>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Try to make the target fraction!</li>
            <li>Match the fraction displayed at the top to win points.</li>
            <li>
              Use operations wisely to form the correct fraction. You can also
              combine digits to form a number!{" "}
            </li>
          </ul>
        </div>
        <div className="flex-grow">
          <div className="font-bold mb-2">Global Ranking</div>
          <div
            className="rounded-lg border border-gray-200 bg-white p-4 shadow"
            style={{ maxHeight: `300px`, overflowY: "auto" }} // Adjust the height dynamically
          >
            <ul className="divide-y divide-gray-200">
              {leaderboard.slice(0, 10).map((entry, index) => (
                <li key={index} className="flex justify-between py-2">
                  <span className="text-sm">{entry.username}</span>
                  <span className="text-sm font-bold">{entry.score}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="lg:hidden absolute bottom-2 right-5 bg-blue-500 text-white p-2 rounded"
          onClick={toggleLeaderboardVisibility}
        >
          Close Leaderboard
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
      {isModalOpen && (
        <button
          className="absolute top-5 right-5 text-gray-500 hover:text-red-500"
          onClick={() => setIsModalOpen(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Game;
