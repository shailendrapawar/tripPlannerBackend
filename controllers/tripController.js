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
            const tripId = req.params.tripId;

            const isDeleted = await TripModel.findByIdAndDelete({ _id: tripId });

            if (isDeleted) {
              return  res.status(200).json({
                    msg: "Trip deleted successfully"
                })
            }

        } catch (err) {
            res.status(400).json({
                msg:"Trip not deleted"
            })
        }

    }








    static getTrip = async (req, res) => {
        res.send("get trip working")
    }


    //========for acccepting an rejecting user=============
    static approveUser = async (req, res) => {
        res.send("aprove trip working")
    }
    static rejectUser = async (req, res) => {
        res.send("reject trip working")
    }

}

export default TripController