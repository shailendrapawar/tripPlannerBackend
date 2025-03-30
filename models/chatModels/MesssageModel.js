import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    message:{
        type:String,trim:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
})

const MessageModel=mongoose.model("Message",messageSchema);
export default MessageModel;