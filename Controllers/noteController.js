import { Notes } from "../models/NotesModel.js";

// create notes 

export const createNotes = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title) {
            return res.status(400).json({ message: "title is required.." })
        }
        if (!content) {
            return res.status(400).json({ message: "content is required.." })
        }


        const notes = await Notes.create({
            user: req.user.id,                 //ye middlew are se aarah hai  jab authenticate ho hr ato ham
            title,
            content
        })


        return res.status(200).json({ message: "notes created sucessfully ", notes });




    } catch (error) {

        return res.status(500).json({ message: "failed to create notes", error: error.message })

    }

}

// get all notes 

export const getAllNotes = async (req, res) => {

    try {
        const notes = await Notes.find({
            user: req.user.id
        }).sort({ updatedAt: -1 })


        return res.status(200).json({ successs: true, notes, count: notes.length })

    } catch (error) {

        return res.status(500).json({ message: "Failed to fetch notes", message: error.message })

    }
}

// 

export const getNotesbyId = async (req, res) => {
    try {

        const notes = await Notes.findById({ _id: req.params.id,user:req.user.id })

        if (!notes) {

            return res.status(404).json({ message: "Note not found or not authorized" });
        }

        return res.status(200).json({ notes, message: "message fetched successfully" });
    } catch (error) {

        return res.status(500).json({ message: "Failed to fetch note", error: error.message });

    }


}


// update notes 

export const UpdateNotes = async (req, res) => {


    try {

        const updatedNotes = await Notes.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { $set: req.body },
            { new: true, runValidators: true }
        )

        if (!updatedNotes) {
            return res.status(404).json({ success: false, message: "Notes not found or unauthorized" })
        }
        return res.status(200).json({
            success: true,
            message: "Notes updated successfully",
            note: updatedNotes,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update note",
            error: error.message,
        });

    }



}

// delete notes 

export const deleteNotes = async (req, res) => {

    try {

        const deleteNote = await Notes.findOneAndDelete(
            { _id: req.params.id, user: req.user.id }
        )

        if (!deleteNote) {

            return res.status(404).json({
                success: false,
                message: "Note not found or unauthorized",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete note",
            error: error.message,
        });

    }
}


// search notes 



export const searchNotes = async (req, res) => {
    // jo bhi sreach me query aae usme agar koi  sepacial character use ho rha taakoi injection na  kar ske security ke  liye ye usn speaicla characters ko  text me convert kar deta hai 

    try {
        const { query } = req.query;


        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const notes = await Notes.find({
            user: req.user.id,

            $or: [{ title: { $regex: escapedQuery, $options: "i" } },

            { content: { $regex: escapedQuery, $options: "i" } }

            ]
        });

        return res.status(200).json({
            success: true,
            count: notes.length,
            notes,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Search failed",
        });
    }
};







