import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("MySQL CONNECTED ✅");
  } catch (err) {
    console.error('Database connection error:', err.message || err);
    throw err;
  }
};


export default prisma;
