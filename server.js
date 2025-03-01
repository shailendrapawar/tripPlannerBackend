import express from "express"
const app=express();
import { configDotenv } from "dotenv";
configDotenv()
import cors from "cors"
import connectDb from "./configs/dbConnect.js";
connectDb()



//=======importing routes=================================
import authRouter from "./routes/authRoutes.js";





//=========root middlewares========================
app.use(cors({
    origin:"*",
    credentials:true,
}))
app.use(express.json())




app.use("/auth",authRouter)

app.get("/",(req,res)=>{
    res.send("wokring server")
})





//=======server port connection====================
const PORT=process.env.PORT||5000
app.listen(PORT,()=>{
    console.log(`server listening at ${PORT}`)
})