import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    message:{
        type:String,trim:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    senderName:{
        type:String,
        trim:true
    }
},{
    timestamps:true
})

const MessageModel=mongoose.model("Message",messageSchema);
export default MessageModel;