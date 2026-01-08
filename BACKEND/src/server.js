import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {ENV} from './lib/env.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import {connectDB} from './lib/db.js';
import { app,server } from './lib/socket.js';
app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin:ENV.CLIENT_URL,
    credentials:true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
const __dirname=path.resolve()

const PORT=ENV.PORT || 3000;

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);
if(process.env.NODE_ENV==='production'){
        app.use(express.static(path.join(__dirname,'../FRONTEND/dist')));
        app.get(/.*/,(_,res)=>{
                res.sendFile(path.join(__dirname,'../FRONTEND/dist/index.html'))
        })}

const start = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message || err);
        process.exit(1);
    }
};

start();