import config from "../config/config.js";

export const MESSAGE_OPENED = `
👋 Hi there!

Thanks for opening a new PR, Consider following the below guide to use me.

- \`/${config.agentName}\`: use this command to scan the PR changes.
- \`/${config.agentName} <your query>\`: use this command to ask queries.
`;

export const MESSAGE_REOPENED = `
👋 Hi there!

Welcome back! Please consider following the guide below to use me effectively:

- \`/${config.agentName}\`: use this command to scan the PR changes.
- \`/${config.agentName} <your query>\`: use this command to ask queries.
`;