import express from "express"
const app=express();
import { configDotenv } from "dotenv";
configDotenv()
import cors from "cors"
import connectDb from "./configs/dbConnect.js";
connectDb()
import cookieParser from "cookie-parser";



//=======importing routes=================================
import authRouter from "./routes/authRoutes.js";
import tripRouter from "./routes/tripRoutes.js";





//=========root middlewares========================
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
}))
app.use(express.json())
app.use(cookieParser())



app.use("/auth",authRouter)
app.use("/trip",tripRouter)

app.get("/",(req,res)=>{
    res.send("wokring server")
})





//=======server port connection====================
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`)
})