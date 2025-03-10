const mongoose = require("mongoose");

const LeaderboardSchema = new mongoose.Schema({
    rank: Number,
    studentId: {
        type: String,
        required: true,
        unique : true,
    },
    name: {
        type: String,
        required : true,
    },
    score: {
        type: Number,
        required : true,
    },
    phoneNumber: {
        type: String,
        required: false,
    }
});

const Leaderboard = mongoose.model("Leaderboard", LeaderboardSchema);
module.exports = Leaderboard;
