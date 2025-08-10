import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chatController.js";
import { attachmentsMulter } from "../middlewares/multer.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, validateHandler } from "../lib/validators.js";

const app = express.Router();

app.use(isAuthenticated)

app.post('/new', newGroupValidator(),validateHandler,newGroupChat)
app.get('/my', getMyChats)
app.get('/my/groups', getMyGroups)

app.put('/addmembers', addMemberValidator(),validateHandler,addMembers)

app.delete('/removemember',removeMemberValidator(), validateHandler, removeMember)

app.delete('/leave/:id', chatIdValidator(),validateHandler, leaveGroup)

app.post('/message',attachmentsMulter,sendAttachmentValidator(),validateHandler,sendAttachments)
app.get('/message/:id',chatIdValidator(),validateHandler,getMessages)
app.route('/:id').get(chatIdValidator(),validateHandler,getChatDetails).put(renameGroupValidator(),validateHandler,renameGroup).delete(chatIdValidator(),validateHandler,deleteChat)




export default app