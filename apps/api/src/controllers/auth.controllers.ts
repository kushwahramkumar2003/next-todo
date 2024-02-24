import { Request, Response } from "express";
import { prisma } from "../services/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";
import z from "zod";

const cookieOptions = {
  maxAge: 1000 * 60 * 60 * 24,
  //   httpOnly: true,
  //   sameSite: "none",
  //   secure: true,
};

export const Signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if ((await prisma.user.findMany({ where: { email } })).length !== 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hasedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hasedPassword,
      name,
    },
  });

  if (!user) {
    return res.status(500).json({ message: "Something went wrong" });
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions);
  return res.status(201).json({ message: "User created successfully" });
};

export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: "1d",
  });
  user.password = "";

  res.cookie("token", token, cookieOptions);
  return res.status(200).json({ message: "Logged in successfully" });
};
