import express from "express"
import TripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadImage.js";





const tripRouter=express.Router();

// =======trip owner actions========================
tripRouter.post("/createTrip",authMiddleware,upload.single("tripImg"),TripController.createTrip)
tripRouter.post("/deleteTrip/:tripId",authMiddleware,TripController.deleteTrip)
tripRouter.get("/getTrip/:tripId",authMiddleware,TripController.getTrip)
tripRouter.get("/getUserHostedTrips",authMiddleware,TripController.getUserHostedTrips)
tripRouter.get("/getAllTrips",authMiddleware,TripController.getAllTrips)

tripRouter.post("/deleteNotification/:notificationId",authMiddleware,TripController.deleteNotification)
tripRouter.post("/approveUser/:requestUserId",authMiddleware,TripController.approveUser)
tripRouter.post("/rejectUser/:requestUserId",authMiddleware,TripController.rejectUser)

//========normal user actions=====================
tripRouter.post("/requestForTrip/:tripId/:userName",authMiddleware,TripController.requestForTrip)
tripRouter.get("/getUserRelatedTrips/:userId",authMiddleware,TripController.userRelatedTrips)


export default tripRouter