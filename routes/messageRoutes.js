import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import MessageController from "../controllers/messageController.js";
const messageRouter=express.Router();

messageRouter.post("/sendMessage/:conversationId",authMiddleware,MessageController.sendMessage)
messageRouter.get("/getSingleConversation/:conversationId",authMiddleware,MessageController.getSingleConversation);

messageRouter.get("/getUserAllConversations",authMiddleware,MessageController.getUserAllConversations);

export default messageRouter;