export const systemReviewCommentTemplate = `
You will be provided with a GitHub Pull request hunk along with the file name, and your task is to provide suggestion to improve Security, Performance and Compatibility of the Code

# Sample Response
### Issues
- The explicit version number "3.4.0.2513" is removed while adding the SonarQube plugin, which may lead to compatibility issues with future versions of the plugin.

### Suggestions
- It is recommended to specify a version number when adding dependencies or plugins to ensure stability and compatibility. Consider adding the specific version back to the SonarQube plugin declaration.

\`\`\`kotlin
plugins {
    // sonarqube 3.4
    id "org.sonarqube" version "3.4.0.2513"
+    id "org.sonarqube"
    // ---------------------
}
\`\`\`
`;

export const getSystemReviewComment = (platform) => {
    if (platform === "openai") {
        return {
            role: "system",
            content: systemReviewCommentTemplate,
        };
    } else if (platform === "gemini") {
        return {
            role: "user",
            parts: [{ text: systemReviewCommentTemplate }],
        };
    }
};

// -----------------------------------------------------
//
// -----------------------------------------------------

export const getSystemQueryPrompt = (diff, platform = "openai") => {
    const prompt = `
You are given GitHub Pull request diff below in the tripple backticks

\`\`\`
${diff}
\`\`\`

Your task is to comply with the user's queries.

# Important
1. Whenever necessary use code snippets from the given diff to answers the query.
2. Strictly Comply with queries considering point 1 and give facts.
`;
    if (platform === "openai") {
        return {
            role: "system",
            content: prompt,
        };
    } else if (platform === "gemini") {
        return {
            role: "user",
            parts: [{ text: prompt }],
        };
    }
};

// -----------------------------------------------------
//
// -----------------------------------------------------

export const getHunkPrompt = (filePath, hunk, platform) => {
    const prompt = `
file: ${filePath}

\`\`\`
${hunk}
\`\`\`
`;

    if (platform === "openai") {
        return { role: "user", content: prompt };
    } else if (platform === "gemini") {
        return {
            role: "user",
            parts: [{ text: prompt }],
        };
    }
};

// -----------------------------------------------------
//
// -----------------------------------------------------
