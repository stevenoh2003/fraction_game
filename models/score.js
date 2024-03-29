import { Schema, model, models } from "mongoose";

// Define the schema for the "Score" model
const ScoreSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required."], // Assuming username is required; adjust as necessary
  },
  score: {
    type: Number,
    required: [true, "Score is required."],
  },
  date: {
    type: Date,
    default: Date.now, // Automatically sets to the current date/time when a new document is created
  },
});

// Prevent model overwrite upon recompilation by checking if it already exists
const Score = models.Score || model("Score", ScoreSchema);

export default Score;
