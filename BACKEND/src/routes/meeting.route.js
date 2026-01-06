import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {createInstantMeeting
} from "../controllers/meeting.controller.js";

const router = express.Router();
router.post("/instant", protectRoute, createInstantMeeting);
export default router;
