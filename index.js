require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ✅ Add a GET route to check if the server is running
app.get("/", (req, res) => {
    res.send("🚀 Webhook Server is Running!");
});

// ✅ Webhook Endpoint for ChartInk
app.post("/", async (req, res) => {
    console.log("📩 Received Alert:", req.body);

    // Extract message from ChartInk payload
    const message = req.body.message || "🚀 Alert received from ChartInk";

    try {
        await sendWhatsAppMessage(message);
        res.status(200).json({ success: true, message: "WhatsApp message sent!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✅ WhatsApp API Function
async function sendWhatsAppMessage(msg) {
    const whatsappAPIUrl = `https://graph.facebook.com/v17.0/${process.env.WA_PHONE_ID}/messages`;

    const payload = {
        messaging_product: "whatsapp",
        to: process.env.RECIPIENT_PHONE, // Your WhatsApp number
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

// ✅ Start Express Server for Local Testing
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook server running on port ${PORT}`));

module.exports = app;
