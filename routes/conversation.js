import { Router } from "express";
import { isAuthenticated } from "../controller/auth.js";
import { getConversation } from "../controller/conversation.js";

const router = new Router();

router.get(
  "/conversation/reciever/:recieverId",
  isAuthenticated,
  getConversation
);

export { router as conversationRouter };
