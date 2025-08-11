import express from "express";
import { acceptFriendRequest, getMyFriends, getMyNotifications, getMyProfile, login, logout, newUser, searchUser, sendFriendRequest } from "../controllers/userController.js";
import {  singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { acceptRequestValidator, loginValidator, registerValidator, sendRequstValidator, validateHandler } from "../lib/validators.js";

const app = express.Router();

app.post('/new',singleAvatar, registerValidator(),validateHandler ,newUser)
app.post('/login',loginValidator(),validateHandler,login)


app.use(isAuthenticated)
app.get('/me',getMyProfile)
app.get('/logout',logout)
app.get('/search',searchUser)

app.put('/sendrequest',sendRequstValidator(),validateHandler,sendFriendRequest)
app.put('/acceptrequest',acceptRequestValidator(),validateHandler,acceptFriendRequest)

app.get('/notifications',getMyNotifications)

app.get('/friends',getMyFriends)


export default app;