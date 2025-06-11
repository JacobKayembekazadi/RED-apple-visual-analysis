// filepath: c:\Users\jacob\Downloads\red apple visual analysis\services\openrouterService.ts
import { OPENROUTER_MODEL } from "../constants";

// Get API key from localStorage or fallback to environment variable
const getApiKey = (): string => {
  // Try to get from localStorage first
  const localKey = localStorage.getItem('openrouter_api_key');
  
  if (localKey) {
    console.log("Using API key from localStorage");
    return localKey;
  }
  
  // Fallback to a temporary backup key
  return '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';
};

// Save API key to localStorage
export const saveApiKey = (key: string): void => {
  localStorage.setItem('openrouter_api_key', key);
};

// Check if the proxy server is available
const isProxyAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/health', { 
      signal: AbortSignal.timeout(1000) 
    });
    return response.ok;
  } catch (e) {
    console.log("Local proxy not available:", e);
    return false;
  }
};

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

// Enhanced helper function for exponential backoff retry strategy
const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 3): Promise<Response> => {
  let retries = 0;
  let lastError: Error | null = null;
  const retryStatusCodes = [408, 429, 500, 502, 503, 504]; // Common retry-able status codes
  
  while (retries < maxRetries) {
    try {
      console.log(`Attempt ${retries + 1}/${maxRetries + 1} to fetch from ${url.split('?')[0]}`);
      
      // Create a timeout for the fetch to prevent long-hanging requests
      const timeoutController = new AbortController();
      const timeoutSignal = timeoutController.signal;
      
      // Set a 30-second timeout (increases with each retry)
      const timeoutDuration = 30000 + (retries * 5000);
      const timeoutId = setTimeout(() => timeoutController.abort(), timeoutDuration);
      
      // Add the abort signal to the options
      const fetchOptions = { 
        ...options,
        signal: timeoutSignal
      };
      
      // Attempt the fetch
      const response = await fetch(url, fetchOptions);
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Check if the status code indicates we should retry
      if (!retryStatusCodes.includes(response.status)) {
        return response; // Success or non-retryable error
      }
      
      lastError = new Error(`HTTP error! status: ${response.status}`);
      console.warn(`Received status ${response.status}, will retry`);
    } catch (error) {
      // Handle AbortError separately
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.warn('Request timed out');
        lastError = new Error('Request timed out');
      } else {
        console.error('Fetch error:', error);
        lastError = error instanceof Error ? error : new Error('Unknown fetch error');
      }
    }
    
    // Calculate backoff delay: 2^retries * 1000ms (1s, 2s, 4s, ...)
    const delay = Math.pow(2, retries) * 1000;
    console.log(`Retry ${retries + 1}/${maxRetries} after ${delay}ms delay...`);
    await new Promise(resolve => setTimeout(resolve, delay));
    retries++;
  }
  
  throw lastError || new Error('Maximum retries reached');
};

// Create a custom error handler function
const handleNetworkError = (error: any): string => {
  console.error("Network error details:", error);
  
  // Check for specific network errors
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    return "Network error: Unable to connect to the OpenRouter API server. This is often caused by network restrictions, firewalls, or connectivity issues. Try opening the network-test.html file in your browser for advanced diagnostics.";
  } else if (error.name === 'AbortError') {
    return "Request timeout: The connection to the OpenRouter API timed out. This could indicate network congestion or server issues. Please try again later.";
  } else if (error.message && error.message.includes('CORS')) {
    return "CORS error: Your browser blocked the request due to Cross-Origin Resource Sharing restrictions. This is typically a browser security feature that prevents requests from one domain to another.";
  }
  
  return `Network error: ${error.message || 'Unknown connection issue'}. Please check your internet connection and try again.`;
};

export const generateText = async (prompt: string): Promise<string> => {
  try {
    // Hard-coded API key as a temporary workaround
    const apiKey = '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';
    
    // Log API key status for debugging
    console.log("API key available:", !!apiKey);
    
    // Get current host for proper CORS configuration
    const currentHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? `http://${window.location.host}` 
      : window.location.origin;
    
    console.log("Current host for CORS:", currentHost);
    
    // Check for network connectivity first
    try {
      console.log("Testing network connectivity...");
      const networkTest = await fetch('https://openrouter.ai/api/v1/health', { 
        method: 'GET',
        // Quick timeout for faster feedback
        signal: AbortSignal.timeout(3000),
        // Add mode to handle CORS
        mode: 'cors',
        cache: 'no-cache'
      });
      console.log("Network connectivity test:", networkTest.status);
    } catch (networkError) {
      console.error("Network connectivity issue:", networkError);
      return handleNetworkError(networkError);
    }
    
    // Log that we're making the API call
    console.log("Making OpenRouter API call...");
    
    // Create request options
    const options = {
      method: "POST",
      mode: 'cors' as RequestMode,
      cache: 'no-cache' as RequestCache,
      credentials: 'same-origin' as RequestCredentials,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": currentHost, // Dynamically set from current host
        "X-Title": "Red Apple Coaching AI Visual Analysis", // Site title for rankings
        "User-Agent": "Mozilla/5.0 Red Apple Coaching App", // Provide a User-Agent for tracking
        "OpenRouter-Overcap-Fallback": "false", // Disable falling back to other models
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        fallbacks: ["openai/gpt-3.5-turbo", "google/gemini-pro"], // Fallback models if primary is unavailable
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500, // Reasonable limit to avoid timeouts
        temperature: 0.7 // Balances creativity and consistency
      })
    };

    // Use our retry function instead of a simple fetch
    let response;
    try {
      response = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", options);
      console.log(`API response status: ${response.status}`);
    } catch (fetchError) {
      console.error("Fetch with retry failed:", fetchError);
      return handleNetworkError(fetchError);
    }
    
    if (!response.ok) {
      const responseText = await response.text();
      console.error("Error response:", responseText);
      
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        // Try to parse the error response as JSON
        const errorData = JSON.parse(responseText);
        if (errorData.error?.message) {
          errorMessage += ` - ${errorData.error.message}`;
        }
      } catch (e) {
        // If parsing fails, just use the response text
        if (responseText) {
          errorMessage += ` - ${responseText}`;
        }
      }
      
      throw new Error(errorMessage);
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
