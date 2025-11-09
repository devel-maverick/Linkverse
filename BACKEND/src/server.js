import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import path from 'path';
import {connectDB} from './lib/db.js';
dotenv.config();
const app=express();
app.use(express.json());
const __dirname=path.resolve()

const PORT=process.env.PORT || 3000;

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
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err.message || err);
        process.exit(1);
    }
};

start();