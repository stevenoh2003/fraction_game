"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

import Modal from "@components/Modal";

const questions = [
  { targetNumerator: 1, targetDenominator: 2, numbers: [1, 2, 3, 4] },
  { targetNumerator: 6, targetDenominator: 19, numbers: [3, 2, 1, 9] },
  { targetNumerator: 99, targetDenominator: 8, numbers: [11, 9, 8, 1] },
  { targetNumerator: 45, targetDenominator: 21, numbers: [5, 3, 7, 9] },
  { targetNumerator: 23, targetDenominator: 32, numbers: [2, 3, 4, 8] },
  { targetNumerator: 69, targetDenominator: 18, numbers: [3, 13, 2, 9] },
  // { targetNumerator: 6, targetDenominator: 7, numbers: [3, 2, 7, 1] },
  // { targetNumerator: 8, targetDenominator: 9, numbers: [4, 9, 2, 16] },
  // { targetNumerator: 9, targetDenominator: 10, numbers: [9, 10, 13, 14] },
  // { targetNumerator: 11, targetDenominator: 12, numbers: [11, 12, 15, 16] },
];

const Game = ( {nickname} ) => {


  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [navigate, setNavigate] = useState(false);


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

  // Call fetchLeaderboard on component mount and after score submission
  useEffect(() => {
    fetchLeaderboard();
  }, [highScore]); // Dependency on highScore ensures leaderboard is refreshed when score updates


useEffect(() => {
  if (navigate) {
    // Navigate to the homepage
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
      setCards(
        cards.map((card) =>
          card.number === item ? { ...card, available: false } : card
        )
      );

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
      setCards(
        cards.map((card) =>
          card.number === item.item ? { ...card, available: true } : card
        )
      );
    }

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
    const numeratorValue = computeFractionPart(userFraction.numerator);
    const denominatorValue = computeFractionPart(userFraction.denominator);
    const userFractionValue = numeratorValue / denominatorValue;
    const targetFractionValue = targetNumerator / targetDenominator;

    if (userFractionValue === targetFractionValue) {
      showModal("Success! You made the correct fraction.", true);
    // Update the high score without submitting it
    setHighScore((prevScore) => prevScore + 1);
      // Load the next question or cycle back to the first
      const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      setCurrentQuestionIndex(nextQuestionIndex);
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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Main game area */}
        <div className="p-5">
          <div id="game-rules" className="mb-5">
            <div className="text-lg font-bold">Welcome! {nickname}</div>

            <h2 className="text-xl font-bold">Game Rules</h2>
            <p>Drag and drop numbers and operations to create your fraction.</p>
            <p>Match the target fraction to win.</p>
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
      </div>
      {/* Sidebar for high score and global ranking */}
      <div className="w-64 h-100 ml-5 p-5 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="mb-4">
          <div className="text-xl font-bold">High Score: {highScore}</div>
        </div>
        <div>
          <div className="font-bold">Global Ranking</div>
          <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4 shadow">
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
      </div>
      <Modal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Game;
