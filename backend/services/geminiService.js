import axios from "axios";

export const generateExplanation = async (problemText) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            throw new Error(
                "GEMINI_API_KEY is not defined in environment variables",
            );
        }

        const prompt = `Explain the following DSA problem in structured format:

1. Intuition
2. Brute force approach
3. Optimized approach
4. Time complexity
5. Space complexity
6. Edge cases
7. Related topics

Problem:
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
