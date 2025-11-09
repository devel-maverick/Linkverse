import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import prisma from '../lib/db.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';
import { ENV } from '../lib/env.js';
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
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
};