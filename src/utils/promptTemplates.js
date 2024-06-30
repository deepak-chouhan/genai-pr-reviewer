const INSTRUCTIONS = `
#### Objective
Evaluate the given GitHub pull request diff thoroughly by identifying specific issues and providing concise, actionable suggestions to fix those issues.

#### Example Output
### Review Comments

#### sumArray function (lines 1-8)
- Issue: The loop in the \`sumArray\` function should iterate up to \`arr.length - 1\` to avoid an out-of-bounds error.
- Suggestion: Change the loop condition to \`i < arr.length\`.

\`\`\`diff
+function sumArray(arr) {
+    let sum = 0;
+    for (let i = 0; i < arr.length; i++) {
+        sum += arr[i];
+    }
+    return sum;
+}
+const numbers = [1, 2, 3, 4, 5];
+console.log(sumArray(numbers));
\`\`\`
`;

export const systemReviewCommentTemplate = `
${INSTRUCTIONS}
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
${INSTRUCTIONS}

\`\`\`
${diff}
\`\`\`

Your task is to comply with the user's queries.

# IMPORTANT
1. Follow the given instructions above.
2. Whenever necessary use code snippets from the given diff to answers the query.
3. Strictly Comply with queries considering point 2 and give facts.
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
