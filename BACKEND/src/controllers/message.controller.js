import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketId, io } from "../lib/socket.js";

import User from "../models/User.js";
import Message from "../models/Message.js";

// ---------------------------- GET ALL CONTACTS ----------------------------
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const users = await User.find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.log("Error in getAllContacts:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------------- GET MESSAGES BY USER ID ----------------------------
export const getMessagesbyUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const userToChatId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessagesbyUserId:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ---------------------------- SEND MESSAGE ----------------------------
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    // No empty messages
    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "Cannot send messages to yourself." });
    }

    // Check receiver exists
    const receiverExists = await User.findById(receiverId);
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl = null;
    if (image) {
      const uploaded = await cloudinary.uploader.upload(image);
      imageUrl = uploaded.secure_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // ---------------- SEND IN REALTIME VIA SOCKET ----------------
    const receiverSocketId = getRecieverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);

  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Error sending message", error: err.message });
  }
};

// ---------------------------- GET CHAT PARTNERS ----------------------------
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId },
        { receiverId: loggedInUserId }
      ]
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map(msg =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      )
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds }
    }).select("-password");

    res.status(200).json(chatPartners);

  } catch (err) {
    console.log("Error in getChatPartners:", err);
    res.status(500).json({ message: "Server Error" });
  }
};
