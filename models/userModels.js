import mongoose from "mongoose"
import notificationSchema from "./notificationModel.js";
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        enum:['male','female','others'],
        required:true,
    },
    avatar:{
        type:String,
        default:""
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    notifications:[{
        type:notificationSchema,
        default:[]
    }]
},{
    timestamps:true
})

const UserModel=mongoose.model("User",userSchema);
export default UserModel