import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()

const connectDb = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL
        const res = await mongoose.connect(mongoUrl)
        if (res) {
            console.log("db connected for trip planner")
        }
    }catch(err){
        console.log("err:="+err)
    }
}

export default connectDb