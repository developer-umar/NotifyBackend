

import { User } from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

export const uploadProfileImage = async (req, res) => {
    try {
        // multer + cloudinary ke baad file yaha milti hai
        if (!req.file) {
            return res.status(400).json({ message: "Image file required" });
        }

        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        /**
        IMPORTANT:
         * Agar pehle se image hai → delete old image from cloudinary
         */
        if (user.imageUrl) {
            const publicId = user.imageUrl
                .split("/")
                .pop()
                .split(".")[0];

            await cloudinary.uploader.destroy(
                `Notify_Documents/${publicId}`
            );
        }

        // new image url save
        user.imageUrl = req.file.path;
        await user.save();

        res.status(200).json({
            message: "Profile image updated successfully",
            imageUrl: user.imageUrl,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Profile image upload failed",
            error: error.message,
        });
    }
};




export const getCurrentUser = async (req, res) => {
  try {
    // protect middleware se req.user milta hai
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
