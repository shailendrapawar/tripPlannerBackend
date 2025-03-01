
class AuthController{

    static register=(req,res)=>{
        console.log(req.body)
        res.send("register wokring")
    }

    static login=(req,res)=>{
        res.send("login wokring")
    }

}

export default AuthController