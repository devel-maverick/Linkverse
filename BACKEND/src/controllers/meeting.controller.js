import crypto from "crypto";
import Meeting from "../models/Meeting.js";
export const createInstantMeeting = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const myId = req.user._id;

    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId required" });
    }
    const existing = await Meeting.findOne({
      users: { $all: [myId, otherUserId] }
    }).sort({ createdAt: -1 });

    if (existing) {
      return res.json({ success: true, meeting: existing });
    }
    const roomId = crypto.randomUUID();
    const jitsiUrl = `https://meet.jit.si/${roomId}`;

    const meeting = await Meeting.create({
      users: [myId, otherUserId],
      roomId,
      jitsiUrl,
    });

    return res.json({ success: true, meeting });

  } catch (err) {
    console.log("Instant Meeting Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
