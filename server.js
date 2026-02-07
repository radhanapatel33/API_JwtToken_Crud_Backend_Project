import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import studentRouters from './routers/students.routes.js'
import userRouters from './routers/users.routes.js'
import { connectDB } from './config/ConnectDB.js';
import userAuth from './Middleware/userJwtAuth.js';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

dotenv.config();
connectDB();

const limiter = rateLimit({
    windowMs:1000*60,
    max:7,
    message:'to many request for IP please try again later'
}) ;



const app = express();
// dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extented: true }));

app.use('./uploads', express.static(path.join(import.meta.dirname, 'uploads')));

app.use(cors({
    origin: 'http://localhost:5173',
    methods : ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(limiter);
app.use('/user', userRouters);
// app.use(userAuth);
app.use('/students',userAuth, studentRouters);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// mongodb+srv://Radhana:radhanarewa@cluster0.2bmdgpi.mongodb.net/?appName=Cluster0
