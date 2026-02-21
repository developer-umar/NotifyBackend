import express from "express"
import { protect } from "../middleware/authmiddleware.js"
import { createNotes, deleteNotes, getAllNotes, getNotesbyId, searchNotes, UpdateNotes } from "../Controllers/noteController.js"


const router = express.Router()




router.post("/create-notes", protect, createNotes);
router.get("/search", protect, searchNotes);
router.get("/get-all-notes", protect, getAllNotes);
router.get("/:id", protect, getNotesbyId);
router.patch("/update/:id", protect, UpdateNotes)
router.delete("/delete/:id", protect, deleteNotes)



export default router;