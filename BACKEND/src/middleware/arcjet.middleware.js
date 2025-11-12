import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";


export const arcjetProtection = async (req, res, next) => {
    try{
        const result = await aj.protect(req);
        if (result.isDenied()){
            if (result.reason.isRateLimit()){
                return res.status(429).json({ message: 'Too many requests, please try again later.' });
            }else if (result.reason.isBot()){
            return res.status(403).json({ message: 'BOT Access denied.' });
            }else {
            return res.status(403).json({ message: 'Access denied by security policy' });
        }}
        if (result.results.some(isSpoofedBot)){
            return res.status(403).json({ Error:"spoofed bot detected",message: 'Spoofed Bot Access denied.' });
        }
        next()
    }catch(err){
        console.log('err in arcjetProtection middleware:',err)
        next()
    }
}