import express from "express";
import Message from "../models/Message.js";

const router = express.Router();


export async function processPayload(payload) {
  const value =
    payload.entry?.[0]?.changes?.[0]?.value ||
    payload.metaData?.entry?.[0]?.changes?.[0]?.value;

  if (!value) {
    console.log("⚠ No value found in payload");
    return;
  }

  const metadata = value.metadata || {};
  const contact = value.contacts?.[0] || {};

  // 1️⃣ Insert new messages
  if (value.messages && Array.isArray(value.messages)) {
    for (let msg of value.messages) {
      const exists = await Message.findOne({ msg_id: msg.id });
      if (!exists) {
        const newMsg = await Message.create({
          wa_id: contact.wa_id || msg.from,
          name: contact.profile?.name || null,
          message: msg.text?.body || "",
          timestamp: new Date(Number(msg.timestamp) * 1000),
          status: "sent",
          msg_id: msg.id,
          meta_msg_id: msg.context?.id || null,
          type: msg.type || "text",
          from_me: msg.from === metadata.display_phone_number
        });
        console.log("✅ Inserted message:", newMsg);
      } else {
        console.log(`ℹ Skipped duplicate msg_id: ${msg.id}`);
      }
    }
  }

  // 2️⃣ Update statuses
  if (value.statuses && Array.isArray(value.statuses)) {
    for (let status of value.statuses) {
      const updated = await Message.findOneAndUpdate(
        { msg_id: status.id },
        { status: status.status },
        { new: true }
      );
      if (updated) {
        console.log(`🔄 Updated status for msg_id ${status.id} → ${status.status}`);
      }
    }
  }
}


router.post("/", async (req, res) => {
  try {
    await processPayload(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
