import express from "express"

import { app, myHttpServer } from "./socket/socket.js";
import { configDotenv } from "dotenv";
configDotenv()
import cors from "cors"
import connectDb from "./configs/dbConnect.js";
// connectDb()
import cookieParser from "cookie-parser";



//=======importing routes=================================
import authRouter from "./routes/authRoutes.js";
import tripRouter from "./routes/tripRoutes.js";
import messageRouter from "./routes/messageRoutes.js";




//=========root middlewares========================

app.use(cors({
    origin: ["http://localhost:5173"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())



app.use("/auth", authRouter)
app.use("/trip", tripRouter)
app.use("/message", messageRouter)

app.get("/", (req, res) => {
    res.send("wokring server")
})





//=======server port connection====================

connectDb().then((res) => {
    const PORT = process.env.PORT || 5000
    myHttpServer.listen(PORT, () => {
        console.log(`http server listening at ${PORT}`)
    })
}).catch((err)=>console.log(err))