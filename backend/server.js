import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import webhookRoutes from "./routes/webhook.js";
import messageRoutes from "./routes/messages.js";
import connectDB from "./config/db.js";
import simulateWebhookRoutes from "./routes/simulateWebhook.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "https://whatsapp-chat-app-iota.vercel.app", 
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/webhook", webhookRoutes);
app.use("/api/messages", messageRoutes);
app.use("/test", simulateWebhookRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

