// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    wa_id: { type: String, required: true }, // WhatsApp user ID
    name: { type: String },                  // User name if available
    message: { type: String, required: true }, // Text content
    timestamp: { type: Date, required: true }, // When message was sent
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    msg_id: { type: String, required: true, unique: true }, // WhatsApp message ID
    meta_msg_id: { type: String }, // Meta's internal message ID if provided
    type: { type: String, default: "text" }, // text, image, etc.
    from_me: { type: Boolean, default: false }, // true if sent by us
  },
  {
    collection: "processed_messages",
  }
);

export default mongoose.model("Message", messageSchema);
