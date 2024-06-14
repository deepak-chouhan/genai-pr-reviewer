import dotenv from "dotenv";
dotenv.config();

export const environmentConfig = {
    environment: process.env.ENVIRONMENT || "DEV",
};
