import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import User from "../models/User.js";

// ------------------ GENERATE COOKIE TOKEN ------------------
const generateToken = (id, res) => {
  const token = jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailregex.test(email))
      return res.status(400).json({ message: "Invalid email format" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // Set JWT cookie
    generateToken(newUser._id, res);

    // Send welcome email
    try {
      await sendWelcomeEmail(newUser.fullName, newUser.email, ENV.CLIENT_URL);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (err) {
    console.log("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------ LOGOUT ------------------
export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
  res.status(200).json({ message: "Logged out successfully" });
};

// ------------------ UPDATE PROFILE ------------------
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic)
      return res.status(400).json({ message: "Profile picture is required" });

    const uploaded = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: uploaded.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log("Profile Update Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
