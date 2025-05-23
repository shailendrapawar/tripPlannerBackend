import UserModel from "../models/userModels.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"
configDotenv()

class AuthController {

    static register = async (req, res) => {
        try {
            const { name, email, password, gender, dob } = req.body
            const isExist = await UserModel.findOne({ email: email })
            if (isExist) {
                return res.status(404).json({
                    msg: "user already exist",
                    success: false
                })
            }

            //===hashing pass====================
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hashSync(password, salt)

            const newUser = new UserModel({
                name,
                email,
                password: hashPass,
                gender,
                dob
            })

            const isCreated = await newUser.save()

            if (isCreated) {
                return res.status(201).json({
                    msg: "User created",
                    success: true
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "internal server error",
                success: false
            })
        }
    }



    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            const isExist = await UserModel.findOne({ email: email })
            if (!isExist) {
                return res.status(404).json({
                    msg: "user dosent exist",
                    success: false
                })
            }
            const isValidPAss = await bcrypt.compareSync(password, isExist.password);

            if (!isValidPAss) {
                return res.status(401).json({
                    msg: "invalid credentials",
                    success: false
                })
            }

            // ======token setting====================
            const tokenData = {
                userId: isExist._id
            }
            const secretToken = process.env.SECRET_TOKEN
            const token = jwt.sign(tokenData, secretToken, { expiresIn: '7d' })

            res.status(200).cookie("token", token, {
                httpOnly: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
                secure:true
            }).json({
                msg: "login successfull",
                success: true,
                user: isExist,
                token: token
            })


        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "internal server error-login",
                success: false

            })
        }
    }


    //========for logout============-=======
    static logout = async (req, res) => {
        res.clearCookie("token");

        return res.status(200).json({
            msg: "user logged out",
            success: true
        })

    }

    static getUserPublicProfile = async (req, res) => {
        try {
            const { userId } = req.params;
            console.log(userId)
            const user = await UserModel.findById(userId).select("-password -isVerified -role -notifications")

            if (user) {
                return res.status(200).json({
                    msg: "user found",
                    userData: user
                })
            }

        } catch (err) {
            return res.status(400).json({
                msg: "user not found",
                userData: []
            })
        }

    }

    static getUserNotifications = async (req, res) => {
        try {
            const userId = req.id;
            const user = await UserModel.findById(userId);
            // console.log(user.notifications)
            if (user) {
                return res.status(200).json({
                    msg: "notifications found",
                    notifications: user.notifications,
                    success: true
                })
            }
        } catch (err) {
            return res.status(400).json({
                msg: "notifications not found",
                success: false
            })
        }
    }

}

export default AuthController