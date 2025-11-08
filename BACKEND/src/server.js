const express=require('express');
const dotenv=require('dotenv');
const authRoutes=require('./routes/auth.route.js');
const messageRoutes=require('./routes/message.route.js');
dotenv.config();
const app=express();

const PORT=process.env.PORT || 3000;

app.use('/api/auth',authRoutes);
app.use('/api/messages',messageRoutes);

app.listen(PORT,()=>{console.log('server is running on port 3000')})