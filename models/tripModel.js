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
    duration:[{
        type:Date,
        required:true
    }],
    destination:{
        type:String,
        required:true
    },
    coords:{
        lat:Number,
        long:Number
    },
    budget:{
        type:String,
        default:""
    },
    itinerary:[{
        day:Number,
        activity:String
    }],

    
    requestedUsers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    approvedUser:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    status:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})

const TripModel=mongoose.model("Trip",tripSchema)