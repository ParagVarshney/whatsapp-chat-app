// routes/messages.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: 1 } }, // sort latest first
      {
        $group: {
          _id: "$wa_id",
          wa_id: { $first: "$wa_id" },
          name: { $first: "$name" },
          lastMessage: { $first: "$message" },
          lastTimestamp: { $first: "$timestamp" },
          status: { $first: "$status" },
        },
      },
      { $sort: { lastTimestamp: -1 } },
    ]);
    res.json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:wa_id", async (req, res) => {
  try {
    const messages = await Message.find({ wa_id: req.params.wa_id }).sort({
      timestamp: 1,
    });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const generateMsgId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
};

router.post("/", async (req, res) => {
  try {
    const { wa_id, message, from_me ,name } = req.body;

    if (!wa_id || !message) {
      return res.status(400).json({ error: "wa_id and message are required" });
    }

    const newMessage = new Message({
      msg_id: generateMsgId(),
      wa_id,
      message,
      from_me: from_me || false,
      name: name||"unknown",
      timestamp: new Date(),
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default router;
