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

Behavior:
Provide a strictly structured explanation for the problem using exactly this format:
1. Intuition
2. Brute force approach
3. Optimized approach
4. Time complexity
5. Space complexity
6. Edge cases
7. Code Implementation in ${language}
8. Related topics

CRITICAL INSTRUCTIONS:
- You are a one-shot reference tool. DO NOT add conversational filler, follow-up questions, or invites to continue the conversation at the end. 
- Return ONLY the structured explanation.
- NEVER use LaTeX or math notation like $n$, $O(n)$, \\sum, etc. Always write math expressions in plain text (e.g., write "n", "O(n)"). The rendering engine does not support LaTeX.
- Use markdown formatting: headers (##), bold (**text**), code blocks (\`\`\`language), inline code (\`code\`), and lists.
- If the text provided by the user is completely unrelated to coding/DSA, respond EXACTLY with: "This assistant focuses on Data Structures and Algorithms problems. Please ask something related to coding interviews."

Keep answers clear and educational.

The Problem:
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
