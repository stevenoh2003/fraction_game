import React, { useState } from "react";

const Game = () => {
  const [targetNumerator, setTargetNumerator] = useState(36);
  const [targetDenominator, setTargetDenominator] = useState(4);
  const [userFraction, setUserFraction] = useState({
    numerator: [],
    denominator: [],
  });
  const [cards, setCards] = useState([
    { number: 1, available: true },
    { number: 2, available: true },
    { number: 3, available: true },
    { number: 4, available: true },
  ]);
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
      alert("Success! You made the correct fraction.");
    } else {
      alert("Try again! The fraction is not correct.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-5 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3">
        <div className="bg-white p-5">
          <div id="game-rules" className="mb-5">
            <h2 className="text-xl font-bold">Game Rules</h2>
            <p>Drag and drop numbers and operations to create your fraction.</p>
            <p>Match the target fraction to win.</p>
          </div>

          <div className="flex justify-center items-center mb-5">
            <div className="flex mb-5">
              <div className="inline-flex flex-col items-center bg-blue-100 p-4 rounded mr-2">
                <div className="text-center font-bold">{targetNumerator}</div>
                <div className="w-full border-t border-gray-400"></div>
                <div className="text-center font-bold">{targetDenominator}</div>
              </div>
            </div>
          </div>

          <div id="workspace-container" className="mb-10 ml-20 mr-20">
            {/* Numerator */}
            <div
              id="numerator"
              className="dropzone bg-gray-100 p-4 rounded mb-2 h-20" // Set height to 32 units (8rem) as an example
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
              className="dropzone bg-gray-100 p-4 rounded h-20" // Set height to 32 units (8rem) as an example
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

          <div className="mt-5">
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
          </div>

          <div className="flex justify-center mb-2">
            <button
              onClick={checkFraction}
              className="bg-blue-500 text-white p-2 rounded m-5"
            >
              Check Fraction
            </button>
            <button
              onClick={() => {}}
              className="bg-blue-500 text-white p-2 rounded m-5"
            >
              Generate New Fraction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
