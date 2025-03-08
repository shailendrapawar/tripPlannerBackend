import TripModel from "../models/tripModel.js"
import { notificationFunction } from "../models/notificationModel.js"
import UserModel from "../models/userModels.js"
class TripController {


    //========== create a new trip ===================
    static createTrip = async (req, res) => {
        try {
            
            const { title, description, startDate, endDate, destination, budget, activities, category } = req.body

            const newTrip = new TripModel({
                host: req.id,
                title,
                description,
                duration: { start: startDate, end: endDate },
                destination: destination,
                budget,
                activities,
                category,

            })
            const isCreated = await newTrip.save();
            if (isCreated) {
                return res.status(201).json({
                    msg: "Trip created",
                    success: true
                })
            }
        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "Trip not created",
                success: false
            })
        }
    }



    //=========== delete a trip ==========================================
    static deleteTrip = async (req, res) => {

        try {
            const { tripId } = req.params;
            const isDeleted = await TripModel.findByIdAndDelete({ _id: tripId });

            if (isDeleted) {
                return res.status(200).json({
                    msg: "Trip deleted successfully"
                })
            }

        } catch (err) {
            res.status(400).json({
                msg: "Trip not deleted"
            })
        }
    }



    //========= for getting a single trip==============================
    static getTrip = async (req, res) => {

        try {
            const { tripId } = req.params;
            console.log(tripId)
            const isTrip = await TripModel.findById({ _id: tripId }).populate({
                path: "host",
                select: "name email gender"
            })

            if (isTrip) {
                return res.status(200).json({
                    msg: "trip found",
                    success: true,
                    data: isTrip
                })
            }

        } catch (err) {
            return res.status(400).json({
                msg: " trip not found",
                success: false,
                data: []
            })
        }
    }

    //==========get all trips==========================

    static getAllTrips=async(req,res)=>{
        try{
            const trips=await TripModel.find({}).populate(
                {
                    path:"host",
                    select:"name _id avatar",
                }
            )
        if(trips){
            return res.status(200).json({
                msg:" trips found",
                trips:trips
            })
        }

        }catch(err){
            console.log(err)
            return res.status(400).json({
                msg:" errro in trip find",
                trips:[]
            })
        }
    }


    // ======== get user hosted trips================== 
    static getUserHostedTrips = async (req, res) => {

        try {
            const hostId = req.id;
            const trips = await TripModel.find({ host: hostId });
            // console.log(trips)

            if(trips){
               return res.status(200).json({
                    mgs:"user hosted trips found",
                    success:true,
                    trips:trips
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                mgs:"internal server error",
                success:false,
                trips:[]
            })
        }

    }



    // =====requesting for joining the trip================
    static requestForTrip = async (req, res) => {
        try {
            const { tripId } = req.params
            const { userName } = req.params
            const userId = req.id
            // console.log(tripId);
            const isRequested = await TripModel.findByIdAndUpdate(tripId, {
                $push: { requestedUsers: userId }
            },
                { new: true, upsert: false }
            )

            if (isRequested) {

                const notifyMsg = `${userName} requested for joining trip`
                const newNotification = notificationFunction(userId, isRequested.host, notifyMsg, "join_request");
                console.log(newNotification)

                const isNotified = await UserModel.findByIdAndUpdate(isRequested.host, {
                    $push: {
                        notifications: newNotification
                    }
                })

                if (isNotified) {
                    return res.status(200).json({
                        msg: "requested for trip",
                        success: true,
                        data: isRequested
                    })
                }
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "internal server error",
                success: false,
                data: []
            })
        }
    }



    //======== acccepting a user request=============
    static approveUser = async (req, res) => {

        try {
            const { requestUserId } = req.params;
            const { tripId, userName } = req.body;

            const isApproved = await TripModel.findByIdAndUpdate(tripId, {
                $push: {
                    approvedUser: requestUserId
                },
                $pull: {
                    requestedUsers: requestUserId
                }
            }, { new: true, upsert: true })

            if (isApproved) {
                const notifyMsg = `${userName} approved your request`
                const newNotification = notificationFunction(isApproved.host, requestUserId, notifyMsg, "approve_request");

                const isNotified = await UserModel.findByIdAndUpdate(requestUserId, {
                    $push: {
                        notifications: newNotification
                    }
                })

                if (isNotified) {
                    res.status(200).json({
                        msg: " user is approved and notified",
                        success: true
                    })
                }
            }

        } catch (err) {
            res.status(400).json({
                msg: " internal server erorr",
                success: false
            })
        }
    }




    //========== reject  a user request========================
    static rejectUser = async (req, res) => {

        try {
            const { tripId } = req.params;
            const { requestUserId, userName } = req.body;

            const isRejected = await TripModel.findByIdAndUpdate(tripId, {
                $pull: {
                    requestedUsers: requestUserId
                }
            })

            if (isRejected) {
                const notifyMsg = `${userName} rejected your request `
                const newNotification = notificationFunction(req.id, requestUserId, notifyMsg, "general");

                const isNotified = await UserModel.findByIdAndUpdate(requestUserId, {
                    $push: {
                        notifications: newNotification
                    }
                })

                if (isNotified) {
                    return res.status(200).json({
                        msg: "user rejected and notified",
                        success: true
                    })
                }
            }

        } catch (err) {
            console.log(err)
        }

    }


}

export default TripController