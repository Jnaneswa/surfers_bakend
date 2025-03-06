const express = require("express");
const Leaderboard = require("../models/leaderboard");
const auth = require("../middleware/auth");

const router = express.Router();

// Get top 10 leaderboard entries (public route)
router.get("/", async (req, res) => {
    try {
        const entries = await Leaderboard.find()
            .sort({ score: -1 }) // Sort by score in descending order
            .limit(10); // Limit to top 10
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new entry (protected route)
router.post("/", auth, async (req, res) => {
    try {
        const { name, score } = req.body;
        const newEntry = new Leaderboard({
            name,
            score: Number(score)
        });
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a score (protected route)
router.put("/:id", auth, async (req, res) => {
    try {
        const { score } = req.body;
        const updatedEntry = await Leaderboard.findByIdAndUpdate(
            req.params.id,
            { score },
            { new: true }
        );
        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete an entry (protected route)
router.delete("/:id", auth, async (req, res) => {
    try {
        const entry = await Leaderboard.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        res.json({ message: "Entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
