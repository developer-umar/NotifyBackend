import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createNote, getAllNotes, updateNote, deleteNote ,searchNotes } from "../controllers/NotesControllers.js";


const router = express.Router();

// CREATE NOTE
router.post("/create", protect, createNote);
router.get("/get-notes", protect, getAllNotes);
router.put("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.get("/search", protect, searchNotes);

export default router;
