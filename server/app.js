import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { errorMiddleware } from './middlewares/error.js';
import { connectDB } from './utils/feature.js';

import chatRoute from './routes/chatRoute.js';
import userRoute from './routes/user.js';
import adminRoute from './routes/admin.js';



dotenv.config({
    path:"./.env"
});
const mongoURI =process.env.MONGO_URI
connectDB(mongoURI);

const app = express();
app.use(express.json()); 
app.use(cookieParser())
const PORT = process.env.PORT || 3000;
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || 'admin-secret-key';



app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/admin', adminRoute);


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use(errorMiddleware)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
