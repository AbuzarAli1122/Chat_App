import jwt from "jsonwebtoken";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/feature.js";

 const adminLogin = TryCatch(async(req,res,next)=>{

    const {secretKey} = req.body;
    const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'MyBollywoodFitness';

    const isMatched = secretKey === adminSecretKey ; 
    if(!isMatched) return next(new ErrorHandler('Invalid Admin Key',401));

    const token = jwt.sign(secretKey,process.env.JWT_SECRET);

    return res.status(200).cookie('myToken-admin',token,{...cookieOptions,
        maxAge:1000*60*15
    }).json({
        success:true,
        message:'Admin logged in successfully',
    })
 })

  const adminLogout = TryCatch(async(req,res,next)=>{


    return res.status(200).cookie('myToken-admin','',{...cookieOptions,
        maxAge:0
    }).json({
        success:true,
        message:'Logged Out Successfully',
    })
 })
 
const getAdminData = TryCatch(async(req,res,next)=>{
     return res.status(200).json({
        success:true,
        admin:true
     })
})

const allUsers = TryCatch(async(req,res,next)=>{

    const users = await User.find();

    const transformUsers = await Promise.all(
        users.map(async({name,username,avatar,_id}) => {

        const [groups,friends] =await Promise.all([
            Chat.countDocuments({groupChat: true, members : _id }),
            Chat.countDocuments({groupChat: false, members : _id })
        ])
        return {
            name,
            username,
            avatar:avatar.url,
            _id,
            groups,
            friends
            }
    })
    )

    return res.status(200).json({
        status: 'success',
        users:transformUsers,
    })

});

const allChats = TryCatch(async(req,res,next)=>{

    const chat = await Chat.find()
    .populate('members', 'name avatar')
    .populate("creator","name avatar");

    const transformChat = await Promise.all(
        chat.map(async({members,_id,groupChat,name,creator}) => {

            const totalMessages  = await Message.countDocuments({chat:_id});

            return {
                _id,
                name,
                groupChat,
                avatar: members.slice(0,3).map((member)=> member.avatar.url),
                members: members.map(({_id,name,avatar})=> ({
                        _id,
                        name,
                        avatar: avatar.url
                })),

                creator:{
                    name:creator?.name || 'None',
                    avatar: creator?.avatar.url || 'None',
                },
                totalMembers : members.length,
                totalMessages
            };
        })
    );


    return res.status(200).json({
        status: 'success',
        chats: transformChat
        })
})

const allMessages = TryCatch(async(req,res,next)=>{

    const message = await Message.find({})
    .populate("sender","name avatar")
    .populate("chat","groupChat");

    const transformMessages = message.map(({content,attachments,sender,_id,createdAt,chat})=>({ 
        _id,
        content,
        attachments,
        createdAt,
        chat: chat._id,
        groupChat:chat.groupChat,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar: sender.avatar.url
        }
    })
);

    return res.status(200).json({
        status: 'success',
        messages: transformMessages,
        });

});

const getDashboardStats = TryCatch(async(req,res,next)=>{

    
    const [groupsCount,usersCount,messageCount,totalChatsCount] = await Promise.all([

        Chat.countDocuments({groupChat:true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments()
    ]);

    const today = new Date();
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt:{
            $gte:last7Days,
            $lte:today
        },
    }).select('createdAt')

     const messages = new Array(7).fill(0);
     const dayInMilliSeconds = 1000 * 60 * 60 * 24;
     last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getTime()-message.createdAt.getTime()) / dayInMilliSeconds ;
        const index = Math.floor(indexApprox);
        messages[6-index]++;
    })

      const stats = {
        groupsCount,
        usersCount,
        messageCount,
        totalChatsCount,
        messagesChart:messages,
    };

    return res.status(200).json({
        status: 'success',
        stats
        });

})


export{
    allUsers,
    allChats,
    allMessages,
    getDashboardStats,
    adminLogin,
    adminLogout,
    getAdminData
}