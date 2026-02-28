import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import bcrypt from "bcryptjs"

const generateAccessToken = (userid) => {

    return jwt.sign({ id: userid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

}

const generateRefreshToken = (userid) => {

    return jwt.sign({ id: userid }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

}


export const Register = async (req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All the field are required " })
        }


        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({ message: "User already  exist" })

        }

        const user = await User.create({ username, email, password });

        return res.status(201).json({ message: "User registered Successfully " });


    } catch (err) {

        return res.status(500).json({ message: err.message });

    }

}


// login user 

export const Login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: "email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "password is required" })

        }


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });

        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = refreshToken
        await user.save();


        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,

        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,

        })

        return res.status(200).json({ message: "User logged in sucessfully", user: { id: user._id, username: user.username, email: user.email } })


    } catch (error) {
        return res.status(500).json({ message: error.message });

    }
}

// refresh token generation 


export const refreshToken = async (req, res) => {
    try {

        const token = req.cookies.refreshToken;

        if (!token) {
          return   res.status(400).json({ message: "token not found " })

        }

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)



        const user = await User.findById(decodedToken.id);

        if (!user || user.refreshToken != token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        //  rotating  refresh token matlab  fir se  refresh  token generate  kar rahe 
        const accessToken = generateAccessToken(user._id);
        const newrefreshToken = generateRefreshToken(user._id);

        user.refreshToken = newrefreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
        })
        res.cookie("refreshToken", newrefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ message: "Token refreshed" })

    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });

    }
}

//   logout 



export const logout = async (req, res) => {


    const token = req.cookies.refreshToken;

    if (token) {
        const user = await User.findOne({ refreshToken: token })

        if (user) {
            user.refreshToken = null;
            user.save();
        }

    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken")

    return res.status(200).json({ message: " Logged out successfully " })


}
// get  current user 


export const getCurrentUser = async (req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password")

        res.status(200).json({ user, message: "User fetched sucessfully " })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}