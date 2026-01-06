import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    scheduledTime: {
      type: Date,
      required: true,
    },

    roomId: {
      type: String,
      unique: true,
      required: true,
    },

    jitsiUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Meeting", meetingSchema);
