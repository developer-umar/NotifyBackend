import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {


        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        imageUrl: String,                 //string url from cloudinary profile image 
    },
    { timestamps: true }
);

//  Password hash before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // next()
});
// mongoose v9 me next() nhi exists karta hai middleware me lagaan eki zraoorrat nhi 
export const User = mongoose.model("User", userSchema);

