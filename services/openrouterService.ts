import { OPENROUTER_MODEL } from "../constants";

// As per guidelines, process.env.API_KEY is assumed to be pre-configured,
// valid, and accessible in the execution context.
// No fallback or console warning should be added here by the application code.
// If process.env.API_KEY is not set, the fetch request may fail with authentication error.

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:5173", // Site URL for rankings
        "X-Title": "Red Apple Coaching AI Visual Analysis", // Site title for rankings
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.choices[0]?.message?.content || "No response generated";
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    if (error instanceof Error) {
        // This message will be displayed in the UI if an API call fails.
        return `Error generating content: ${error.message}. This could be due to network issues, an invalid or misconfigured API key, or problems with the API service. Please check the browser console for more technical details.`;
    }
    return "An unknown error occurred while generating content. Please check the browser console for details.";
  }
};
