const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    rank: Number,
    studentId: String,
    name: String,
    score: Number,
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard;
