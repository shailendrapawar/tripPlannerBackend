import express from "express"
import TripController from "../controllers/tripController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const tripRouter=express.Router();

tripRouter.post("/createTrip",authMiddleware,TripController.createTrip)
tripRouter.post("/deleteTrip",authMiddleware,TripController.deleteTrip)
tripRouter.get("/getTrip",authMiddleware,TripController.getTrip)

tripRouter.post("/approveUser",authMiddleware,TripController.approveUser)
tripRouter.post("/rejectUser",authMiddleware,TripController.rejectUser)


export default tripRouter