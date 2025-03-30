import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    latestMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    tripId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trip"
    },

},{
    timestamps:true
})

const ConversationModel=mongoose.model("Conversation",conversationSchema);

export default ConversationModel;