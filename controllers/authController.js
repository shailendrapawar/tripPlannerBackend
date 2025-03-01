import UserModel from "../models/userModels.js"
import bcrypt from "bcrypt"


class AuthController{

    static register=async(req,res)=>{
        try{
            const{name,email,password,gender}=req.body
        const isExist=await UserModel.findOne({email:email})   
         if(isExist){
            return res.status(404).json({
                msg:"user already exist",
                success:false
            })
         }

         //===hashing pass====================
         const salt =await bcrypt.genSalt(10)
         const hashPass=await bcrypt.hashSync(password,salt)

         const newUser=new UserModel({
            name,
            email,
            password:hashPass,
            gender
         })

         const isCreated=await newUser.save()

         if(isCreated){
            return res.status(201).json({
                msg:"User created",
                success:true
            })
         }
        }catch(err){
            console.log(err)
            return res.status(400).json({
                msg:"User created",
                success:true
            })
        }

    }

    static login=(req,res)=>{
        res.send("login wokring")
    }

}

export default AuthController