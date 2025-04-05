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
    tripImg:{
        type:String
    },
    tripId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trip"
    },
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    }]

},{
    timestamps:true
})

const ConversationModel=mongoose.model("Conversation",conversationSchema);

export default ConversationModel;