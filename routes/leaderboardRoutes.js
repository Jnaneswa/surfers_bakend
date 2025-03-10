const express = require("express");
const Leaderboard = require("../models/leaderboard");
const auth = require("../middleware/auth");

const router = express.Router();

// Function to recalculate ranks based on scores
const updateRanks = async () => {
    const entries = await Leaderboard.find().sort({ score: -1 });

    for (let i = 0; i < entries.length; i++) {
        entries[i].rank = i + 1;
        await entries[i].save();
    }
};

// Get all leaderboard entries (sorted by rank)
router.get("/", async (req, res) => {
    try {
        const entries = await Leaderboard.find().sort({ rank: 1 });
        console.log(entries);
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new leaderboard entry
router.post("/", auth, async (req, res) => {
    try {
        const { name, score, studentId, phoneNumber } = req.body;

        console.log("Received data:", req.body);

        if (!name || score === undefined) {
            return res.status(400).json({ message: "Name and score are required." });
        }

        let existingEntry = await Leaderboard.findOne({ studentId });

        if (existingEntry) {
            // Compare scores and update only if new score is higher
            if (score > existingEntry.score) {
                existingEntry.score = Number(score);
                await existingEntry.save();
                await updateRanks();
                return res.status(200).json({ message: "Score updated", entry: existingEntry });
            } else {
                return res.status(200).json({ message: "New score is not higher, no update needed", entry: existingEntry });
            }
        } 

        // ✅ Create and save new entry correctly
        const newEntry = new Leaderboard({
            name,
            studentId,
            score: Number(score),
            phoneNumber
        });

        const savedEntry = await newEntry.save();
        await updateRanks(); // Update ranks after adding a new entry

        res.status(201).json(savedEntry);
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Update leaderboard entry by ID (score update)
router.put("/:id", auth, async (req, res) => {
    try {
        const { score } = req.body;


        if (score === undefined) {
            return res.status(400).json({ message: "Score is required." });
        }

        const updatedEntry = await Leaderboard.findByIdAndUpdate(
            req.params.id,
            { score },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({ message: "Entry not found." });
        }

        await updateRanks(); // Update ranks after modifying score

        res.json(updatedEntry);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const entry = await Leaderboard.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        await updateRanks(); // Update ranks after deletion

        res.json({ message: "Entry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
