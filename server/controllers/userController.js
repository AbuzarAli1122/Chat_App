import { compare } from 'bcrypt';
import {User} from '../models/user.js'
import {Chat} from '../models/chat.js'
import {Request} from '../models/request.js'


import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from '../utils/feature.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMember } from '../lib/helper.js';


// create a new user 
const newUser = async (req, res,next) => {
    try {
        const { name, username, password,bio } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const file =req.file;
    if(!file) return next(new ErrorHandler("Please upload a  Avatar",400));

    const result = await uploadFilesToCloudinary([file]);

        const avatar = {
            public_id: result[0].public_id,  
            url: result[0].url,
        };

        const user = await User.create({ name, bio,username, password, avatar });

       
        sendToken(res,user,201,"User Created Successfully")

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

const login = TryCatch(async(req, res,next) => {

    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid Username or Password ",404));

    const isMatch = await compare(password,user.password);
    if(!isMatch) return next(new ErrorHandler("Invalid Username or Password ",404));

    sendToken(res,user,200,"You are logged In")

}
)


const getMyProfile = TryCatch(async(req,res,next)=>{

    const user = await User.findById(req.user);
    if(!user) return next(new ErrorHandler("User not found",404));
    res.status(200).json({
        success:true,
        user

    })
})

const logout = TryCatch(async(req,res,next)=>{

    res.status(200).cookie('myToken',"",{...cookieOptions, maxAge:0}).json({
        success:true,
        message:"Logged Out Successfully"

    })
})


const searchUser = TryCatch(async(req,res,next)=>{
    const { name='' } = req.query;

    const myChats = await Chat.find({groupChat:false,members:req.user})

    // All users that are my friends or i have chatted with
    const allUserFromMyChats = myChats.map((chat)=> chat.members).flat();
    // 
    const allUserExceptMeAndFriends = await User.find({
        _id:{$nin : allUserFromMyChats},
        name:{$regex:name,$options:'i'},
    })

    const users = allUserExceptMeAndFriends.map(({_id,name,avatar})=>({_id ,name,avatar: avatar.url}))
    res.status(200).json({
        success: true,
        users
    })
});

const sendFriendRequest = TryCatch(async(req,res,next)=>{

    const {userId} = req.body;
    const request = await Request.findOne({
        $or:[
            {sender:req.user , receiver:userId},
            {sender:userId,receiver:req.user}
        ]
    })

    if(request) return next(new ErrorHandler('Request already sent',400));

    await Request.create({ 
        sender:req.user,
        receiver:userId
    });

    emitEvent(req,NEW_REQUEST,[userId],{ some: "data checking" })
    console.log("Friend Request Sent to User ID:", userId);

    return res.status(200).json({
        success:true,
        message:"Friend Request Sent Successfully"
    })
})

const acceptFriendRequest = TryCatch(async(req,res,next)=>{

    const {requestId,accept} = req.body;
    const request = await Request.findById(requestId)
    .populate('sender','name')
    .populate('receiver','name')
    if(!request) return next(new ErrorHandler('Request not found',404))
    
    if(request.receiver._id.toString()!== req.user.toString())
        return next(new ErrorHandler('You are not authorized to accept this request',401))
    
    if(!accept){
        await request.deleteOne()
        return res.status(200).json({
            success:true,
            message:"Friend Request Rejected"
            })
    }
    const members=[request.sender._id,request.receiver._id]
    await Promise.all([
        Chat.create({
            members,
            name:`${request.sender.name} - ${request.receiver.name}`
        }),
        request.deleteOne()
    ])
    emitEvent(req,REFETCH_CHATS,members)

    return res.status(200).json({
        success:true,
        message:"Friend Request Accepted",
        senderId:request.sender._id,
        })

});


const getMyNotifications = TryCatch(async(req,res,next)=>{

    const requests = await Request.find({receiver:req.user}).populate('sender', 'name avatar');

    const allRequest = requests.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url,
        }
    }))
    return res.status(200).json({
        success:true,
        allRequest,
        });
})


const getMyFriends = TryCatch(async(req,res,next)=>{

    const chatId = req.query.chatId;

    const chats = await Chat.find({members:req.user,groupChat:false})
        .populate('members', 'name avatar');

    const friends = chats.map(({members}) => {
        const otherUser = getOtherMember(members, req.user);
        return {
            _id: otherUser._id,
            name: otherUser.name,
            avatar: otherUser.avatar.url,
        };
    });

    if (chatId) {
        const chat = await Chat.findById(chatId);
        const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));
        return res.status(200).json({
            success: true,
            availableFriends,
        });
    } else {
        return res.status(200).json({
            success: true,
            friends,
        });
    }
});

export {
    login,newUser,
    getMyProfile,logout,
    searchUser,
    sendFriendRequest,
    acceptFriendRequest,
    getMyNotifications,
    getMyFriends,
}