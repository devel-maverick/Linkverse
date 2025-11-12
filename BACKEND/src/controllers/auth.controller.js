import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import prisma from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { ENV } from '../lib/env.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
            },
        });

        if (newUser) {
            if (process.env.JWT_SECRET) {
                generateToken(newUser.id, res);
            }
            try{
            await sendWelcomeEmail(newUser.fullName,newUser.email,ENV.CLIENT_URL)
            }catch(err){
               console.error('Failed to send welcome email:', err);

            }

            return res.status(201).json({
                message: 'User created successfully',
                user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email },
            });
        } else {
            return res.status(400).json({ message: 'Invalid data' });
        }
    } catch (err) {
        console.error('err in signup:',err);
        return res.status(500).json({ message: 'Server Error' });
    }
};
export const login = async (req, res) =>{
    const {email,password}=req.body;
    try{

        const user=await prisma.user.findUnique({where:{email}})
        if(!user){
            return res.status(400).json({message:'Invalid credentials'})
        }
        const ispasswordMatch=await bcrypt.compare(password,user.password);
        if(!ispasswordMatch){
            return res.status(400).json({message:'Invalid credentials'})
        }
        generateToken(user.id,res)
        res.status(200).json({
            id:user.id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })
    }catch(err){
        console.log('err in login:',err)
        res.status(500).json({message:'Server Error'})

    }
};

export const logout = (req, res) => {
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:'Logged out successfully'})
}

export const updateProfile = async (req, res) => {
    try{
        const {profilePic}=req.body;
        if (!profilePic) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }
        const userId=req.user.id;
        const uploaded=await cloudinary.uploader.upload(profilePic)
        const updatedUser=
        await prisma.user.update({
            where:{id:userId}
            ,data:{
                profilePic:uploaded.secure_url
            }
    })
    res.status(200).json(updatedUser)
    }catch(err){
        console.log('err in updateProfile:',err)
        res.status(500).json({message:'Server Error'})

    }
}

