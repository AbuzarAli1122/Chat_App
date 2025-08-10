import mongoose from "mongoose"
import jwt from "jsonwebtoken"

const cookieOptions = {
        httpOnly:true,
        maxAge: 10 *24 *60*60*1000,
        sameSite:'none',
        secure:true
    }
    
const connectDB = (uri)=>{
    mongoose.connect(uri,{dbName :'Chat_hub'})
    .then((data)=>{
        console.log(`Connected to DB : ${data.connection.host}`)
    })
    .catch((err)=>{
        throw err
    })
}

const sendToken = (res,user,code,message)=>{

    const token = jwt.sign({_id: user._id},process.env.JWT_SECRET)
    return res.status(code).cookie("myToken",token,cookieOptions).json({
        success:true,
        message
    })
} 

const emitEvent = (req,event,users,data)=>{
    console.log('emitting event',event)
};

const deleteFilesFromCloudinary = async(public_id) =>{

};


export { connectDB,sendToken,cookieOptions,emitEvent,deleteFilesFromCloudinary}