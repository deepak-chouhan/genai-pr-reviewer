function generateCommentChain(messages, platform = "openai") {
    if (!messages) {
        throw new Error("Error! Message: messages not valid or undefined");
    }

    let messageChain = [];

    if (platform === "openai") {
        messages.map((message) => {
            const role = message.user.type === "Bot" ? "assistant" : "user";
            const content = message.body;

            messageChain.push({
                role,
                content,
            });
        });
    } else if (platform === "gemini") {
        messages.map((message) => {
            const role = message.user.type === "Bot" ? "model" : "user";
            const parts = [{ text: message.body }];

            messageChain.push({
                role,
                parts,
            });
        });
    }

    return messageChain;
}

export default generateCommentChain;
