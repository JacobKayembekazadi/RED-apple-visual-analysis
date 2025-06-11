import { GoogleGenerativeAI } from '@google/genai';

// Function to load API key from environment or fallback to a reasonable default for testing
const getGoogleAPIKey = (): string => {
  // Check for environment variable (useful in production)
  const envKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
  if (envKey) return envKey;
  
  // Return null if no API key is found
  return '';
};

export const generateTextWithGoogle = async (prompt: string): Promise<string> => {
  try {
    const apiKey = getGoogleAPIKey();
    
    if (!apiKey) {
      throw new Error('Google AI API key not found. Please add your API key to .env.local as VITE_GOOGLE_AI_API_KEY');
    }
    
    console.log("Using Google Generative AI API");
    
    // Initialize the Google Generative AI SDK
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error calling Google Generative AI:", error);
    if (error instanceof Error) {
      return `Error generating content with Google AI: ${error.message}`;
    }
    return "An unknown error occurred while using Google AI.";
  }
};

// Function to check if the Google API is available and working
export const checkGoogleAPIAvailability = async (): Promise<{available: boolean, message: string}> => {
  try {
    const apiKey = getGoogleAPIKey();
    
    if (!apiKey) {
      return { 
        available: false, 
        message: 'Google AI API key not configured'
      };
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Simple test prompt
    const result = await model.generateContent("Hello");
    const response = await result.response;
    
    if (response && response.text()) {
      return {
        available: true,
        message: 'Google AI API is available'
      };
    } else {
      return {
        available: false,
        message: 'Google AI API returned an empty response'
      };
    }
  } catch (error) {
    console.error("Error checking Google API:", error);
    return {
      available: false,
      message: error instanceof Error ? error.message : 'Unknown error checking Google API'
    };
  }
};
