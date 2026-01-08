import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL (Supabase) CONNECTED ✅");
  } catch (err) {
    console.error("Database connection error:", err.message || err);
    process.exit(1); 
  }
};

export default prisma;
