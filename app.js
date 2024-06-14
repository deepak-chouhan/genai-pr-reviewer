import http from "http";
import fs from "fs";
import { App, Octokit } from "octokit";
import { createNodeMiddleware } from "@octokit/webhooks";
import webhookHandlers from "./src/controllers/webhookHandlers.js";
import handleEnterpriseUrl from "./src/utils/handleEnterpriseUrl.js";
import config from "./src/config/config.js";
import logger from "./src/logger/logger.js";

// GitHub App Info
const appId = config.appId;
const webhookSecret = config.webhookSecret;
const privateKeyPath = config.privateKeyPath;
const privateKey = fs.readFileSync(privateKeyPath, "utf-8");

// Github App Info - Only required for Enterprise
let enterpriseHost;
if (config.enterpriseUrl) {
    const enterpriseUrl = handleEnterpriseUrl(config.enterpriseUrl);
    enterpriseHost = {
        Octokit: Octokit.defaults({
            baseUrl: `${enterpriseUrl}/api/v3`,
        }),
    };
}

// Create App
const app = new App({
    appId,
    privateKey,
    webhooks: {
        secret: webhookSecret,
    },
    ...enterpriseHost,
});

// Handles Webhook Events
webhookHandlers(app);

// Launch Server
const port = config.port;
const path = "/api/webhook";
const localWebhookUrl = `http://localhost:${port}${path}`;

const middleware = createNodeMiddleware(app.webhooks, { path });

http.createServer(middleware).listen(port, () => {
    logger.info(`Server is listening on ${localWebhookUrl}`);
    logger.info("Press Ctrl + C to quit.");
});
