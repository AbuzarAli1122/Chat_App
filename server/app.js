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
import { NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from './constants/events.js';
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

const PORT = process.env.PORT || 3000;
export const envMode = process.env.NODE_ENV.trim() || "PRODUCTION"
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';
export const userSocketIDS = new Map();




// Cloudinary config
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

app.set('io', io);

// Middlewares
app.use(express.json()); 
app.use(cookieParser())
app.use(cors(corsOptions))

// Routes

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/admin', adminRoute);


// Socket Middleware
io.use((socket,next)=>{
    cookieParser()(socket.request, socket.request.res, async(err)=>{
       await socketAuthenticator(err,socket,next)
    })
});

io.on('connection',(socket)=>{

    const user = socket.user;
    const userId = user._id.toString(); 

  if (!userSocketIDS.has(userId)) {
    userSocketIDS.set(userId, []);
  }
    userSocketIDS.get(userId).push(socket.id);


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

    socket.on(START_TYPING,({members,chatId})=>{
      const membersSocket = getSockets(members)
      socket.to(membersSocket).emit(START_TYPING,{ chatId})
    });

      socket.on(STOP_TYPING,({members,chatId})=>{
      const membersSocket = getSockets(members)
      socket.to(membersSocket).emit(STOP_TYPING,{ chatId})
    })

    socket.on("disconnect", () => {

    const sockets = userSocketIDS.get(userId) || [];
    const updated = sockets.filter((id) => id !== socket.id);

    if (updated.length > 0) {
      userSocketIDS.set(userId, updated);
    } else {
      userSocketIDS.delete(userId);
    }
  });
})


app.use(errorMiddleware)

// Start server only after DB connection
const startServer = async() => {
  try {
    connectDB(process.env.MONGO_URI); 
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} in ${envMode} Mode`);
    });
  } catch (error) {
    console.error('Failed to connect to DB:', error);
    process.exit(1);
  }
};

startServer();
