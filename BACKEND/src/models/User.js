import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    profilePic: {
      type: String,
      default: "",
    },
    sentMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
    ],
    receivedMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Message" }
    ],
    initiatedMeetings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }
    ],
    receivedMeetings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }
    ],
  },

  { timestamps: true }
);

export default mongoose.model("User", userSchema);
