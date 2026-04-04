import axios from "axios";

export const generateExplanation = async (problemText, language = "Python") => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error(
                "GEMINI_API_KEY is not defined in environment variables",
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
- You are a one-shot reference tool. DO NOT add conversational filler, follow-up questions, or invites to continue the conversation at the end (e.g., do not say "Let me know if you have questions" or "Would you like me to clarify?"). 
- Return ONLY the structured explanation.
- If the text provided by the user is completely unrelated to coding/DSA, respond EXACTLY with: "This assistant focuses on Data Structures and Algorithms problems. Please ask something related to coding interviews."

Keep answers clear and educational.

The Problem:
${problemText}`;

        const MODEL = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

        const response = await axios.post(
            url,
            {
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );

        // Extract the text content from the Gemini response structure
        return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error(
            "Gemini API Error:",
            error.response?.data || error.message,
        );
        throw new Error("Failed to generate explanation from Gemini API");
    }
};
