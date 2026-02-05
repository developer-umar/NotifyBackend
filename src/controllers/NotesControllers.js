import { Note } from "../models/Note.js";






// createing notes 
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // basic validation
        if (!title || !content) {
            return res
                .status(400)
                .json({ message: "Title and content are required" });
        }

        const note = await Note.create({
            user: req.user._id, // protect middleware se aata hai
            title,
            content,
        });

        res.status(201).json({
            message: "Note created successfully",
            note,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create note",
            error: error.message,
        });
    }
};



export const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user._id, // sirf logged-in user ke notes
        }).sort({ updatedAt: -1 }); // latest updated first

        res.status(200).json({
            success: true,
            count: notes.length,
            notes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message,
        });
    }
};


export const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        // atleast ek field update ho
        if (!title && !content) {
            return res
                .status(400)
                .json({ message: "Nothing to update" });
        }

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id, // ownership check
            },
            {
                ...(title && { title }),
                ...(content && { content }),
            },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found or not authorized",
            });
        }

        res.status(200).json({
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update note",
            error: error.message,
        });
    }
};



export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id, // ownership check
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found or not authorized",
            });
        }

        res.status(200).json({
            message: "Note deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete note",
            error: error.message,
        });
    }
};

// searching 

export const searchNotes = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Search query is required",
            });
        }

        const notes = await Note.find({
            user: req.user._id,
            title: {
                $regex: q,
                $options: "i", // case-insensitive
            },
        }).sort({ updatedAt: -1 });

        res.status(200).json({
            success: true,
            count: notes.length,
            notes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Search failed",
            error: error.message,
        });
    }
};
