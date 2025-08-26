import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";

import { deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/feature.js";
import { ErrorHandler } from "../utils/utility.js";


const newGroupChat = TryCatch(async(req,res,next)=>{

    const {name,members} = req.body;

    const allMembers = [...members,req.user];

     await Chat.create({
        name,
        groupChat:true,
        creator:req.user,
        members:allMembers
     })

     emitEvent(req,ALERT,allMembers,`Welcome to ${name} group chat`)
     emitEvent(req,REFETCH_CHATS,members)

     return res.status(201).json({
        success:true,
        message:'Group  Created Successfully'
    })
})

const getMyChats = TryCatch(async(req,res,next)=>{
   
    const chats = await Chat.find({ members: { $in: [req.user] } }).populate('members', 'name avatar');

    const transformedChats = chats.map (({_id,name,members,groupChat})=>{
           
        const otherMembers= getOtherMember(members,req.user)
        return {
            _id,
            groupChat,
            name: groupChat 
            ? name 
            : otherMembers?.name || "Unknown",
            avatar: groupChat 
            ? members.slice(0,3).map(({avatar})=> avatar.url) 
            : otherMembers?.avatar?.url ? [otherMembers.avatar.url] : [],
            members: members.reduce((prev,curr)=>{
                if(curr._id.toString() !== req.user.toString()){
                    prev.push(curr._id)
                }
                return prev
            },[]),
        }
    })

     return res.status(200).json({
        success:true,
        message: transformedChats
    })
});


const getMyGroups = TryCatch(async(req,res,next)=>{

    const chats = await Chat.find({
        members: req.user,
        groupChat: true,
        creator: req.user,
    }).populate('members',"name avatar")

    const groups = chats.map(({members,_id,groupChat,name})=>
    ({
        _id,
        groupChat,
        name,
        avatar:members.slice(0,3).map(({avatar})=> avatar.url)
    })
    )
    return res.status(200).json({
        success:true,
        groups
})
})


const addMembers = TryCatch(async(req,res,next)=>{

    const {chatId, members} = req.body;
    const chat = await Chat.findById(chatId)

    if(!chat) return next(new ErrorHandler('Chat not Found',404))

    if(!chat.groupChat) return next(new ErrorHandler('This is not a Groupchat',400))
    if(chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler('You are not allowed to add members',403))


    const allNewMembersPromise = members.map(i=> User.findById(i,'name'))

   

    const allNewMembers = await Promise.all(allNewMembersPromise)

     const uniqueMembers = allNewMembers.filter((i)=>!chat.members.includes(i._id.toString())).map((i)=> i._id);

    chat.members.push(...uniqueMembers)

    if(chat.members.length > 100) return next(new ErrorHandler('Group item limit reached'))
    await chat.save()

    const allUsersName = allNewMembers.map((i)=> i.name).join(',');

    emitEvent(req,ALERT,chat.members,`${allUsersName} has added in the  group`)
    emitEvent(req,REFETCH_CHATS,chat.members);

    return res.status(200).json({
        success:true,
        message: 'Members added successfully',
    })
   
})



const removeMember = TryCatch(async(req,res,next)=>{

   const {userId,chatId} = req.body;
   const [chat,user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId,'name')
    ])
    if(!chat) return next(new ErrorHandler('Chat not found',404))
    if(!chat.groupChat) return next(new ErrorHandler('This is not a Group chat',400))
    if(chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler('You are not allowed to add members',403))

    if(chat.members.length <=3){

        return next(new ErrorHandler('Group should have at least 3 members',400))

    }

    chat.members = chat.members.filter(
        (member)=> member.toString() !== userId.toString()
    )
    await chat.save()

    emitEvent(
        req,
        ALERT,
        chat.members,
        `${user.name} has been removed from the group`
    );
    emitEvent(req,REFETCH_CHATS,chat.members); 

    return res.status(200).json({
        success:true,
        message: 'Member removed successfully',
    })
   
})



const leaveGroup = TryCatch(async(req,res,next)=>{

    const chatId = req.params.id;
    const chat = await Chat.findById(chatId)
   
    if(!chat) return next(new ErrorHandler('Chat not found',404))
    if(!chat.groupChat) return next(new ErrorHandler('This is not a Group chat',400))

    // its for when admin leave 
    const remainingMember = chat.members.filter(
            (member)=> member.toString() !== req.user.toString()
        );
    
    if (chat.creator.toString() === req.user.toString()){
        const randomElement = Math.floor(Math.random()* remainingMember.length)
        const newCreator = remainingMember[randomElement];
        chat.creator = newCreator;
    }
    
    chat.members = remainingMember;

    const [user] = await Promise.all([User.findById(req.user,'name'),chat.save()])

    emitEvent(
        req,
        ALERT,
        chat.members,
        `User ${user.name} has left the group`
    );

    return res.status(200).json({
        success:true,
        message: 'Member removed successfully',
    })
   
})


const sendAttachments = TryCatch(async(req,res,next)=>{

    const { chatId } = req.body;

    const files = req.files || [];
    
      if(files.length<1) return next(new ErrorHandler('Please Upload Attachments',400)) 

    if(files.length>5) return next(new ErrorHandler('Maximum 5 attachments allowed',400))
   
    const [chat, me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user,'name'),
    ]);
    if(!chat) return next(new ErrorHandler('Chat not found',404))
    
        // Uploaded files here

        const attachments = await uploadFilesToCloudinary(files);


        const messageForDb = {
            content:'', 
            attachments,
            sender:me._id,
            chat:chatId
        };

         const message = await Message.create(messageForDb)

        const messageForRealTime = {
            ...messageForDb,
              _id: message._id,
        sender: { _id: me._id, name: me.name },
       
};

       
        
        emitEvent(req, NEW_MESSAGE ,chat.members,{
            message:messageForRealTime,
            chatId,
        })


        emitEvent(req,NEW_MESSAGE_ALERT,chat.members,{chatId})

    return res.status(200).json({
        success:true,
        message,
        })
})


const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === 'true') {
    const chat = await Chat.findById(req.params.id)
      .populate('members', 'name avatar')
      .lean();

    if (!chat) return next(new ErrorHandler('Chat not found', 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url
    }));

    chat.messages = chat.messages.map(msg => ({
      ...msg,
      sender: {
        _id: msg.sender._id,
        name: msg.sender.name,
        avatar: msg.sender.avatar.url
      }
    }));

    return res.status(200).json({
      success: true,
      chat
    });
  } else {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return next(new ErrorHandler('Chat not found', 404));

    return res.status(200).json({
      success: true,
      chat
    });
  }
});



const renameGroup = TryCatch(async(req,res,next)=>{
    const chatId = req.params.id;
    const {name} = req.body;
    const chat = await Chat.findById(chatId);
    if(!chat) return next(new ErrorHandler('Chat not found',404))
    if(!chat.groupChat) return next(new ErrorHandler('This is not a group chat',404))
    if(chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler('You are not allowed to rename Group',403))
        chat.name = name;
    await chat.save()
    emitEvent(req,REFETCH_CHATS,chat.members)
    return res.status(200).json({
        success:true,
        message:'Group name Changed Successfully'
        })

});
const deleteChat = TryCatch(async(req,res,next)=>{

    const chatId = req.params.id;
    const chat = await Chat.findById(chatId);
    if(!chat) return next(new ErrorHandler('Chat not found',404)) 

    const members = chat.members;

    if(chat.groupChat && chat.creator.toString() !== req.user.toString()) return next(new ErrorHandler('You are not allowed to delete'))
    if(!chat.groupChat && !chat.members.includes(req.user.toString())){
        return next(new ErrorHandler('You are not allowed to delete',403))
    }
    // Here we will delete all messages and attachment from cloudinary 
    const messageWithAttachment  = await Message.find({chat:chatId, attachments:{ $exists:true,$ne:[]}}) 
    const public_ids = [];

    messageWithAttachment.forEach(({attachments})=>{
        attachments.forEach((public_id)=>{
            public_ids.push(public_id)
        })
    })

    await Promise.all([
        // Delete Files from Cloudinary 
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({chat:chatId})
    ])
    emitEvent(req,REFETCH_CHATS,members)

    return res.status(200).json({
        success:true,
        message:'Chat deleted Successfully'
    })

})

const getMessages = TryCatch(async(req,res,next)=>{

    const chatId = req.params.id;
    const { page = 1} = req.query;
    const resultPerPage = 20

    const skip = (page -1)*resultPerPage ;

    const [messages,totalMessagesCount] = await Promise.all([
        Message.find({chat:chatId})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(resultPerPage)
        .populate('sender','name')
        .lean(),
        Message.countDocuments({chat:chatId})
    ])

    const totalPages = Math.ceil(totalMessagesCount/resultPerPage)||0;

    return res.status(200).json({
        success:true,
        messages: messages.reverse(),
        totalPages
})
})

export {
    newGroupChat,
    getMyChats,
    getMyGroups,
    addMembers,
    removeMember,
    leaveGroup,
    sendAttachments,
    getChatDetails,
    renameGroup,
    deleteChat,
    getMessages
}