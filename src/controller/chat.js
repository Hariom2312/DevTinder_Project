const User = require("../model/User");
const Message = require("../model/Message.js");
const mongoose = require("mongoose");

/**
 * Save a new message
 */
const postMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const message = await Message.create({ senderId, receiverId, text });
    res.status(201).json(message);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Fetch chat history between two users
 */
const getHistory = async (req, res) => {
  try {
    const { userId, targetUserId } = req.params;

    // ✅ Check if IDs are valid
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid user IDs" });
    }

    // ✅ (Optional) check if they are connected
    const user = await User.findById(userId).select("connections").lean();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // // If you haven't added `connections` in User schema yet, comment this out
    // if (!user.connections || !user.connections.includes(targetUserId)) {
    //   return res.status(403).json({ error: "Users are not connected" });
    // }

    // ✅ Fetch messages
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
}

module.exports = {getHistory , postMessage};
