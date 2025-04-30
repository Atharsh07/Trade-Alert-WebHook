// api/webhook.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const serverless = require("serverless-http");

const app = express();
app.use(express.json());

app.get("/api/webhook", (req, res) => {
    res.send("🚀 Webhook Server is Running!");
});

app.post("/api/webhook", async (req, res) => {
    console.log("📩 Received Alert:", req.body);

    const message = req.body.message || "🚀 Alert received from ChartInk";

    try {
        await sendWhatsAppMessage(message);
        res.status(200).json({ success: true, message: "WhatsApp message sent!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

async function sendWhatsAppMessage(msg) {
    const whatsappAPIUrl = `https://graph.facebook.com/v22.0/${process.env.WA_PHONE_ID}/messages`;

    const payload = {
        messaging_product: "whatsapp",
        to: process.env.RECIPIENT_PHONE, 
        type: "text",
        text: { body: msg },
    };

    try {
        const response = await axios.post(whatsappAPIUrl, payload, {
            headers: {
                Authorization: `Bearer ${process.env.WA_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        console.log("✅ WhatsApp Message Sent:", response.data);
    } catch (error) {
        console.error("❌ Error sending WhatsApp message:", error.response?.data || error.message);
        throw new Error("Failed to send WhatsApp message.");
    }
}

module.exports = serverless(app);
