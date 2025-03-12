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
    },
    type:{
        type:String,
        enum:["join_request","approve_request","general"]
    },
    relatedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Trip"
    }
},{
    timestamps:true
})

//=======just exportung schema==========
export default notificationSchema;

export const notificationFunction=(senderId,receiverId,message,type,relatedTo)=>{
    return {
        senderId:senderId,
        receiverId:receiverId,
        message:message,
        type:type,
        relatedTo:relatedTo
    }
}