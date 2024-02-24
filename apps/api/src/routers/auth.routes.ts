import express from "express";
import { loginSchema, signUpSchema } from "../schemas/authSchemas";
import { Login, Signup } from "../controllers/auth.controllers";
import { validateData } from "../middlewares/validationMiddleware";

const userRouter = express.Router();

userRouter.post("/signup", validateData(signUpSchema), Signup);
userRouter.post("/login", validateData(loginSchema), Login);

export default userRouter;
