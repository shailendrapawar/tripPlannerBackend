import express from "express"
import TripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const tripRouter=express.Router();

// =======trip owner actions========================
tripRouter.post("/createTrip",authMiddleware,TripController.createTrip)
tripRouter.post("/deleteTrip/:tripId",authMiddleware,TripController.deleteTrip)
tripRouter.get("/getTrip/:tripId",authMiddleware,TripController.getTrip)

tripRouter.post("/approveUser",authMiddleware,TripController.approveUser)
tripRouter.post("/rejectUser",authMiddleware,TripController.rejectUser)

//========normal user actions=====================
tripRouter.post("/requestForTrip/:tripId/:userName",authMiddleware,TripController.requestForTrip)


export default tripRouter