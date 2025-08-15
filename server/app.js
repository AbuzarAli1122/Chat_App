import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/feature.js';
import {Server} from 'socket.io'
import { createServer} from 'http'
import { v4 as uuid} from 'uuid'
import cors from 'cors'
import {v2 as cloudinary} from 'cloudinary'
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from './constants/events.js';
import { getSockets } from './lib/helper.js';
import { Message } from './models/message.js';
import { corsOptions } from './constants/config.js';
import { socketAuthenticator } from './middlewares/auth.js';


import chatRoute from './routes/chatRoute.js';
import userRoute from './routes/user.js';
import adminRoute from './routes/admin.js';


dotenv.config({
    path:"./.env"
});
const mongoURI =process.env.MONGO_URI
connectDB(mongoURI);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const server = createServer(app)
const io = new Server(server,{
    cors: corsOptions
});

app.use(express.json()); 
app.use(cookieParser())
app.use(cors(corsOptions))

const PORT = process.env.PORT || 3000;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';

export const userSocketIDS = new Map();



app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/admin', adminRoute);


app.get('/', (req, res) => {
    res.send('Hello World');
});
// Socket Middleware
io.use((socket,next)=>{
    cookieParser()(socket.request, socket.request.res, async(err)=>{
       await socketAuthenticator(err,socket,next)
    })
});

io.on('connection',(socket)=>{

    const user = socket.user;
    

    userSocketIDS.set(user._id.toString(),socket.id);

    console.log('a user connected', userSocketIDS);

    socket.on(NEW_MESSAGE,async({chatId,members,message})=>{
        
        const messageForRealTime = {
            content:message,
            _id:uuid(),
            sender:{
                _id:user._id,
                name:user.name
            },
            chat:chatId,
            createdAt: new Date().toISOString()
        };

        const messageForDb = {
            content:message,
            sender: user._id,
            chat: chatId,
        };

        console.log('Emitting', messageForRealTime)



        const membersSocket = getSockets(members)
        io.to(membersSocket).emit(NEW_MESSAGE,{
            chatId,
            message:messageForRealTime
        });
        io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{ chatId })
    
    try {
        await Message.create(messageForDb)
    } catch (error) {
        console.log('error creating message', error)
    }

    })

    socket.on('disconnect',()=>{
        console.log('user disconnected');
        userSocketIDS.delete(user._id.toString());
    })
})


app.use(errorMiddleware)

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${envMode} Mode`);
});
