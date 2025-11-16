import express from 'express';
import { getAllContacts,getChatPartners,getMessagesbyUserId,sendMessage} from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { arcjetProtection } from '../middleware/arcjet.middleware.js';
const router=express.Router();
// The middlewares execute in order — so requests get rate-limited first, then authenticated. This is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(protectRoute);
router.get("/contacts",getAllContacts)
router.get("/chats",getChatPartners)
router.get("/:id",getMessagesbyUserId)
router.post('/send/:id',sendMessage)
export default router;