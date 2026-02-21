import mongoose from "mongoose";


const NotesSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    title: {

        type: String,
        required: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,

    }

}, { timestamps: true });

export const Notes = mongoose.model("Notes", NotesSchema);

