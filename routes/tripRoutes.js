import express from "express"
import TripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const tripRouter=express.Router();

tripRouter.post("/createTrip",authMiddleware,TripController.createTrip)
tripRouter.post("/deleteTrip",TripController.deleteTrip)
tripRouter.get("/getTrip",TripController.getTrip)

tripRouter.post("/approveUser",TripController.approveUser)
tripRouter.post("/rejectUser",TripController.rejectUser)


export default tripRouter