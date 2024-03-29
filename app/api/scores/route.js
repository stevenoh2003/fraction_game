// app/api/scores/index.route.js
import Score from "@models/score"; // Adjust the path as necessary
import { connectToDB } from "@utils/database"; // Adjust the path as necessary

export const POST = async (request) => {
  const { username, score } = await request.json();

  try {
    await connectToDB();
    const newScore = new Score({ username, score });

    await newScore.save();
    return new Response(
      JSON.stringify({ message: "Score submitted successfully." }),
      { status: 201 }
    );
  } catch (error) {
    return new Response("Failed to submit score", { status: 500 });
  }
};
