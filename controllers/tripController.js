import TripModel from "../models/tripModel.js"
import { notificationFunction } from "../models/notificationModel.js"
import UserModel from "../models/userModels.js"
import ConversationModel from "../models/chatModels/ConversationModel.js"
import uploadToCloudinary from "../configs/cloudinaryUploads.js"

class TripController {


    //========== create a new trip ===================
    static createTrip = async (req, res) => {

        try {

            const { title, description, startDate, endDate, destination, budget, activities, category } = req.body
            const {url,publicId}=await uploadToCloudinary(req.file.path)
            // console.log(req.body)
            // console.log(req.body.activities)
            
            const newTrip = new TripModel({
                host: req.id,
                title,
                description,
                tripImg:{url,publicId},
                duration: { start: startDate, end: endDate },
                destination: JSON.parse(destination),
                approvedUser:[req.id],
                budget,
                activities:JSON.parse(activities),
                category,
            })
            
            const isCreated = await newTrip.save();

            if (isCreated) {
                const newConversation = new ConversationModel({
                    chatName: isCreated.title,
                    users: [isCreated.host],
                    groupAdmin: isCreated.host,
                    tripId: isCreated._id,
                    tripImg:isCreated.tripImg.url
                })

                const isConversationCreated = await newConversation.save();

                if (isConversationCreated) {
                    return res.status(201).json({
                        msg: "Trip created",
                        success: true
                    })
                }

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
                select: "name email gender avatar"
            }).populate({
                path: "approvedUser",
                select: " name gender avatar"
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

    static getAllTrips = async (req, res) => {
        try {
            const trips = await TripModel.find({}).populate(
                {
                    path: "host",
                    select: "name _id avatar",
                }
            )
            if (trips) {
                return res.status(200).json({
                    msg: " trips found",
                    trips: trips
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "error in finding trips",
                trips: []
            })
        }
    }


    // ======== get user hosted trips================== 
    static getUserHostedTrips = async (req, res) => {

        try {
            const hostId = req.id;
            const trips = await TripModel.find({ host: hostId }).populate({
                path: "approvedUser",
                select: "name avatar email bio dob gender"
            });
            // console.log(trips)
            if (trips) {
                return res.status(200).json({
                    mgs: "user hosted trips found",
                    success: true,
                    trips: trips
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                mgs: "internal server error",
                success: false,
                trips: []
            })
        }

    }



    // =====requesting for joining the trip================
    static requestForTrip = async (req, res) => {
        try {
            const { tripId } = req.params
            const { userName } = req.params
            const userId = req.id
            // console.log("calling");
            const isRequested = await TripModel.findByIdAndUpdate(tripId, {
                $push: { requestedUsers: userId }
            },
                { new: true, upsert: false }
            )

            if (isRequested) {
                const notifyMsg = `${userName} requested for joining trip to ${isRequested.destination.destination}`
                const newNotification = notificationFunction(userId, isRequested.host, notifyMsg, "join_request", isRequested._id);
                // console.log(newNotification)

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

            //=========sending notiify to owner==========

            if (isApproved) {
                // ========adding approved user to group==============
                const isAddedToGroup=await ConversationModel.findOneAndUpdate({tripId:tripId},{
                    $push:{users:requestUserId}
                })
                if(isAddedToGroup){
                    console.log("added")
                }

                const notifyMsg = `${userName} approved your request, check your DM for more`
                const newNotification = notificationFunction(isApproved.host, requestUserId, notifyMsg, "approve_request", isApproved._id);
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

            const { requestUserId } = req.params;
            const { tripId, userName } = req.body;

            const isRejected = await TripModel.findByIdAndUpdate(tripId, {
                $pull: {
                    requestedUsers: requestUserId
                }
            }, {
                new: true, upsert: true
            })

            if (isRejected) {
                const notifyMsg = `${userName} rejected your request `
                const newNotification = notificationFunction(req.id, requestUserId, notifyMsg, "general", isRejected._id);

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
            return res.status(400).json({
                msg: "some error in rejecting user request",
                success: false
            })
        }

    }

    static deleteNotification = async (req, res) => {
        try {
            const { notificationId } = req.params;
            const userId = req.id;
            // console.log(userId)
            // console.log(notificationId)
            const isDeleted = await UserModel.findByIdAndUpdate({ _id: userId, }, {
                $pull: { notifications: { _id: notificationId } },

            }, {
                new: true, upsert: true
            });
            // console.log(isDeleted)
            if (isDeleted) {
                res.status(200).json({
                    msg: "notification deleted",
                    success: true,
                    data: isDeleted
                })
            }
        } catch (err) {
            console.log(err)
            res.status(200).json({
                msg: "internal server error",
                success: false
            })
        }
    }

    static userRelatedTrips = async (req, res) => {
        try {
            // const hostId = req.id;
            const { userId } = req.params;
            const trips = await TripModel.find({ host: userId }).populate(
                {
                    path: "host",
                    select: "name _id avatar",
                }
            );
            // console.log(trips)
            if (trips) {
                return res.status(200).json({
                    mgs: "user hosted trips found",
                    success: true,
                    trips: trips
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                mgs: "internal server error",
                success: false,
                trips: []
            })
        }

    }
}


export default TripController