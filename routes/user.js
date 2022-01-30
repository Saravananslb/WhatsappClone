import { Router } from "express";
import { isAuthenticated } from "../controller/auth.js";
import {
  getContact,
  getProfile,
  getUser,
  multerMiddleware,
  updateUser,
  uploadImage,
} from "../controller/user.js";

const router = new Router();

router.get("/getuser", isAuthenticated, getUser);

router.put("/:userId/setuser", isAuthenticated, updateUser);

router.post("/getcontact", isAuthenticated, getContact);

router.get("/getprofile", isAuthenticated, getProfile);

router.post("/upload", isAuthenticated, multerMiddleware, uploadImage);

export { router as userRouter };
