import express from "express"
import AuthController from "../controllers/authController.js"

const authRouter=express.Router()

authRouter.post("/register",AuthController.register)
authRouter.post("/login",AuthController.login)
authRouter.post("/logout",AuthController.logout)

export default authRouter