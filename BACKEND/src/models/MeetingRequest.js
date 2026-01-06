import mongoose from "mongoose";

const meetingRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    requestedTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "RESCHEDULE"],
      default: "PENDING",
    },

    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      default: null,
    },
  },

  { timestamps: true }
);

export default mongoose.model("MeetingRequest", meetingRequestSchema);
