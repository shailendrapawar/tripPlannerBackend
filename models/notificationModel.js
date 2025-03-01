import mongoose from "mongoose"

const notificationSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String,
        // required:true
    },
    read:{
        type:Boolean,
        default:false
    }
})

//=======just exportung schema==========
export default notificationSchema;