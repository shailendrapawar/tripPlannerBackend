import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"
configDotenv()

const authMiddleware = async (req, res, next) => {

    // console.log(req.cookies)
    try {
        const { token } = req.cookies
        console.log(token)
        if (!token) {
            return res.status(401).json({
                msg: "User not authenticated (token)",
                success: false
            })
        }
        const decode = await jwt.verify(token,process.env.SECRET_TOKEN)
        if (decode) {
            console.log(decode.userId)
            req.id = decode.userId
            next()
        }
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            msg: "Token expired",
            success: false
        })
    }


}

export default authMiddleware