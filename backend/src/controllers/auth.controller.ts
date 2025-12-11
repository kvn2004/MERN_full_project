import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto"
import { generateTokenAndSetCookie } from "../utils/generateToken.util";
import { sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail } from "../utils/sendEmail";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, name, gender } = req.body;
  try {
    // TODO: register logic
    if (!email || !password || !name || !gender) {
      throw new Error("Missing required fields");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      gender,
      verificationCode,
      verificationCodeExpires,
    });
    await newUser.save();
    generateTokenAndSetCookie({ res }, newUser._id.toString());

    sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser: {
        ...newUser.toObject(),
        password: undefined,
        // verificationCode: undefined,
        // verificationCodeExpires: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationCode: code,
      verificationCodeExpires: { $gt: new Date() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification code" });
    }
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user.email as string, user.name as string);
    res.status(200).json({
      message: "Email verified successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // TODO: login logic
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = user.password? await bcrypt.compare(password, user.password) : false;

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    generateTokenAndSetCookie({ res }, user._id.toString());
    
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    // TODO: logout logic
    res.clearCookie("token");

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const resetCode = crypto.randomBytes(3).toString("hex");
    const resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = resetCodeExpires;
    await user.save();

    // TODO: send reset code email

    await sendPasswordResetEmail(email, `http://localhost:3000/reset-password?code=${resetCode}`);
    res.status(200).json({
      message: "Password reset code sent",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};


