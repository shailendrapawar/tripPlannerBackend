import mongoose from "mongoose"
const tripSchema=new mongoose.Schema({

    host:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tripImg:{
        url:String,
        publicId:String
    },
    category:{
        type:String
    },
    duration:{
        start:Date,
        end:Date
    },
    destination:{
        destination:String,
        longitude:Number,
        latitude:Number
    },
    coords:{
        lat:Number,
        long:Number
    },
    budget:{
        type:Number,
        default:0
    },
    activities:[{
        day:Number,
        activity:String
    }],
    
    requestedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
        default:[]
    }],
    approvedUser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:[]
    }],
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const TripModel=mongoose.model("Trip",tripSchema)
export default TripModel