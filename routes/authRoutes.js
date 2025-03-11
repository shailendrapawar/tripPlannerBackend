import express from "express"
import AuthController from "../controllers/authController.js"
import authMiddleware from "../middlewares/authMiddleware.js"
const authRouter=express.Router()

authRouter.post("/register",AuthController.register)
authRouter.post("/login",AuthController.login)
authRouter.post("/logout",AuthController.logout)
authRouter.get("/getUserPublicProfile/:userId",AuthController.getUserPublicProfile)
authRouter.get("/getUserNotifications",authMiddleware,AuthController.getUserNotifications)

export default authRouter