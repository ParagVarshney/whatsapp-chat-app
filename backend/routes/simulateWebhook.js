import express from "express";
import fs from "fs";
import path from "path";
import { processPayload } from "./webhook.js";

const router = express.Router();
router.get("/", async (req, res) => {
  try {
    const payloadDir = path.join(process.cwd(),"sample_payloads");
    const files = fs.readdirSync(payloadDir).filter(file => file.endsWith(".json"));

    for (let file of files) {
      console.log(`📂 Processing file: ${file}`);
      const content = fs.readFileSync(path.join(payloadDir, file), "utf-8");
      const payload = JSON.parse(content);
      await processPayload(payload);
    }

    res.json({ success: true, filesProcessed: files.length });
  } catch (err) {
    console.error("Error simulating webhook:", err);
    res.status(500).json({ error: "Failed to simulate webhook" });
  }
});

export default router;
