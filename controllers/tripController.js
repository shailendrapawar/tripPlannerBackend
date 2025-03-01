import TripModel from "../models/tripModel.js"
import { notificationFunction } from "../models/notificationModel.js"
import UserModel from "../models/userModels.js"
class TripController {
    static createTrip = async (req, res) => {
        try {
            const { title, description, startDate, endDate, destination, budget, itinerary } = req.body

            const newTrip = new TripModel({
                host: req.id,
                title,
                description,
                duration: { start: startDate, end: endDate },
                destination,
                budget,
                itinerary,
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



    //=====================================================
    static deleteTrip = async (req, res) => {
        try {
            console.log(req.params)
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



    static getTrip = async (req, res) => {

        try {
            const { tripId } = req.params;
            console.log(tripId)
            const isTrip = await TripModel.findById({ _id: tripId }).populate({
                path: "host",
                select: "name email gender"
            })

            console.log(isTrip)

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


    //========for acccepting an rejecting user=============
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
                const newNotification = notificationFunction(isApproved.host, requestUserId, notifyMsg);

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




    static rejectUser = async (req, res) => {

        try {
            const { tripId } = req.params;
            const { requestUserId,userName } = req.body;

            const isRejected = await TripModel.findByIdAndUpdate(tripId, {
                $pull: {
                    requestedUsers:  requestUserId
                }
            })

            if (isRejected) {
                const notifyMsg = `${userName} rejected your request `
                const newNotification = notificationFunction(req.id, requestUserId, notifyMsg);

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
                const newNotification = notificationFunction(userId, isRequested.host, notifyMsg);
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


}

export default TripController