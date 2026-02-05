import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};




//  Step 1: User Registration
export const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if student already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({
            email,
            password, // Pass plain password, schema will hash

        });

        const token = generateToken(user._id);
        res.status(201).json({ token, message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error in registration', error: error.message });
    }
};


//  Step 2: user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            user,
            token,
            message: 'Login successful',
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            message: 'Login error',
            error: error.message,
        });
    }
};


