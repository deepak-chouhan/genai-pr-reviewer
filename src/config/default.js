import dotenv from "dotenv";
dotenv.config();

export const defaultConfig = {
    // Github App
    appId: process.env.APP_ID || "",
    webhookSecret: process.env.WEBHOOK_SECRET || "",
    privateKeyPath: process.env.PRIVATE_KEY_PATH || "",
    enterpriseUrl: process.env.ENTERPRISE_URL || "",

    // AI API Key
    platform: process.env.PLATFORM || "openai",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    geminiApiKey: process.env.GEMINI_API_KEY || "",

    // Server
    port: process.env.PORT || 3000,
};
