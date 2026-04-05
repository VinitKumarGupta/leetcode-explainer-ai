import axios from "axios";

export const generateExplanation = async (problemText, language = "Python") => {
    try {
        const apiKey = process.env.MODEL_API_KEY;

        if (!apiKey) {
            throw new Error(
                "MODEL_API_KEY is not defined in environment variables",
            );
        }

        const prompt = `You are an expert Data Structures and Algorithms tutor helping students understand coding interview problems.

GOAL:
Produce a clear, structured, technical explanation suitable for interview preparation.

OUTPUT FORMAT:
Return ONLY the following sections in this EXACT order using markdown headers (##):

## Intuition
Explain the core idea in simple terms. Describe why the approach works.

## Brute Force Approach
Describe the naive solution approach clearly.

## Optimized Approach
Explain the optimal solution with reasoning and key insights.
Mention the algorithm pattern used (e.g., sliding window, two pointers, dynamic programming, BFS, greedy, etc.).

## Time Complexity
State complexity in plain text format (e.g., O(n), O(n log n)) and explain briefly.

## Space Complexity
State auxiliary space complexity only.

## Edge Cases
List important corner cases as bullet points.
Avoid generic cases like "empty input" unless truly relevant.

## Code Implementation in ${language}
Provide clean, leetcode-format code inside EXACTLY ONE markdown code block.
Do NOT include multiple code blocks.

## Related Topics
List 3-6 relevant DSA topics or patterns.

CRITICAL RULES:
- Return ONLY the structured explanation.
- Do NOT include conversational text, greetings, or follow-up questions.
- Do NOT include any text before the first section header.
- Do NOT include any text after the Related Topics section.
- Do not assume constraints if not provided.
- If multiple optimal approaches exist, present the most commonly expected interview solution only.
- Keep explanations concise but complete.
- Ensure markdown formatting renders correctly.
- NEVER use LaTeX or math notation like $n$, $O(n)$, \\sum, etc. Always write math expressions in plain text (e.g., write "n", "O(n)").
- Use markdown formatting: headers (##), bold (**text**), code blocks (\`\`\`language), inline code (\`code\`), and lists.

LENGTH OPTIMIZATION:
- If the problem is simple or well-known (e.g., Two Sum, Binary Search, Valid Parentheses), keep explanations brief and direct.
- If the problem is medium or hard (e.g., Dynamic Programming, Graphs, Backtracking), provide deeper intuition and reasoning.
- Avoid unnecessary repetition.
- Prefer clarity over verbosity.

INVALID INPUT HANDLING:
If the user input is unrelated to coding or DSA, respond EXACTLY with:

This assistant focuses on Data Structures and Algorithms problems. Please ask something related to coding interviews.

USER INPUT:
The user may provide a LeetCode problem title, number, full description, or a URL. 

PRECISION RULE:
- Prioritize the problem title and description over URLs to ensure high accuracy.
- If only a URL is provided, infer the problem from the path but cross-reference it with your internal DSA knowledge base.

PROBLEM:
${problemText}`;

        // We use Llama 3 70B on Groq for excellent reasoning
        const MODEL = "llama-3.1-8b-instant";
        const url = "https://api.groq.com/openai/v1/chat/completions";

        const response = await axios.post(
            url,
            {
                model: MODEL,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.2, // Low temperature for more factual, consistent responses
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            },
        );

        // Extract the text content from the Groq (OpenAI-format) response structure
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("Groq API Error:", error.response?.data || error.message);
        throw new Error("Failed to generate explanation from Groq API");
    }
};
