class TripController{


    static createTrip=async(req,res)=>{
        console.log(req.id)
        res.send(req.id)
    }
    static deleteTrip=async(req,res)=>{
        res.send("delete trip working")
    }
    static getTrip=async(req,res)=>{
        res.send("get trip working")
    }


    //========for acccepting an rejecting user=============
    static approveUser=async(req,res)=>{
        res.send("aprove trip working")
    }
    static rejectUser=async(req,res)=>{
        res.send("reject trip working")
    }
    
}

export default TripController