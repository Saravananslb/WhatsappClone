import { Router } from "express";
import { signIn, signUp } from "../controller/auth.js";

const router = new Router();

router.post("/signin", signIn);

router.post("/signup", signUp);

export { router as authRouter };
