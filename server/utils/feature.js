import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import { v4 as uuid} from "uuid"
import {v2 as cloudinary} from "cloudinary"
import { getBase64 } from "../lib/helper.js"

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


const uploadFilesToCloudinary = async(files=[]) =>{

  const uploadPromises = files.map((file)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(getBase64(file),{
            resource_type:'auto',
            public_id:uuid(),
        },(error,result)=>{
            if(error) return reject(error)
                resolve(result);
        });
    });
  });

  try {
    const results = await Promise.all(uploadPromises);
    const formatedResults = results.map((result)=>({
        public_id: result.public_id,
        url: result.secure_url,
    }));
    return formatedResults;
  } catch (error) {
    throw new Error('Error Uploading Files To Cloudinary',error);
  }
};
const deleteFilesFromCloudinary = async(public_id) =>{

};


export { connectDB,sendToken,cookieOptions,emitEvent,uploadFilesToCloudinary,deleteFilesFromCloudinary}