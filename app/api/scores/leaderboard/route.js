// app/api/scores/leaderboard.route.js
import Score from "@models/score"; // Adjust the path as necessary
import { connectToDB } from "@utils/database"; // Adjust the path as necessary

export const GET = async (request) => {
  try {
    await connectToDB();

    const leaderboard = await Score.find({})
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(10) // Optionally limit to top 10 scores
      .exec();

    return new Response(JSON.stringify(leaderboard), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch leaderboard", { status: 500 });
  }
};
