import TripModel from "../models/tripModel.js"
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
        // res.send("get trip working")
    }


    //========for acccepting an rejecting user=============
    static approveUser = async (req, res) => {
        res.send("aprove trip working")
    }
    static rejectUser = async (req, res) => {
        res.send("reject trip working")
    }


    static requestForTrip = async (req, res) => {

        try {
            const { tripId } = req.params
            const userId = req.id
            console.log(tripId);

            const isRequested = await TripModel.findByIdAndUpdate(tripId, {
                $push: { requestedUsers: userId }
            },
                { new: true, upsert: false }
            )

            if (isRequested) {
                return res.status(200).json({
                    msg: "requested for trip",
                    success: true,
                    data: isRequested
                })
            }

        } catch (err) {
            console.log(err)
            return res.status(400).json({
                msg: "internal server error",
                success: false,
                data:[]
            })
        }
    }

}

export default TripController