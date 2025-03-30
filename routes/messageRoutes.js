import express from "express";
import authMiddleware from "../middlewares/authMiddleware";
import MessageController from "../controllers/messageController";
const messageRouter=express.Router();

messageRouter.post("/sendMessage",authMiddleware,MessageController.sendMessage)
messageRouter.get("/getConversation",authMiddleware,MessageController.getConversation);

export default messageRouter;