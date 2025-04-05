import {v2 as cloudinary}  from "cloudinary";
import { configDotenv } from "dotenv";
import fs from "fs"
configDotenv();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET,
    api_key:process.env.CLOUD_API_KEY
})


const uploadToCloudinary=async(filepath)=>{
    const res=await cloudinary.uploader.upload(filepath,{
        folder:"packpals"
    });
    // console.log(res)
    if(res){
        await fs.unlinkSync(filepath);
    }
    return {url:res.secure_url,publicId:res.public_id}
}


export default uploadToCloudinary;