# API Troubleshooting Guide

## OpenRouter API Connection Issues

If you encounter errors with the OpenRouter API integration in the Red Apple Coaching: AI Visual Analysis application, this guide will help you diagnose and solve common issues.

## Diagnostic Tools

The application includes two diagnostic tools to help identify connection issues:

1. **API Test Button in the UI**: Located in the application interface to quickly test API connectivity
2. **Standalone Network Test Page**: Open `network-test.html` in your browser for detailed connectivity diagnostics

## Common Error: Failed to Fetch

### Error Message:
```
Error generating content: Failed to fetch. This could be due to network issues, an invalid or misconfigured API key, or problems with the API service.
```

### Potential Causes and Solutions:

1. **Network Connectivity Issues**
   - Browser cannot establish a connection to OpenRouter's servers
   - Solution: Check your internet connection and firewall settings

2. **CORS (Cross-Origin Resource Sharing) Restrictions**
   - Browser security preventing requests to OpenRouter
   - Solution: Ensure you're accessing the application from the correct origin

3. **Proxy or VPN Interference**
   - Corporate networks or VPNs may block API calls
   - Solution: Try a different network without these restrictions

## Common Error: HTTP 401 Unauthorized

### Error Message:
```
Error generating content: HTTP error! status: 401. This could be due to network issues, an invalid or misconfigured API key, or problems with the API service.
```

### Potential Causes and Solutions:

1. **Invalid or Expired API Key**
   - OpenRouter API keys have expiration dates
   - Solution: Generate a new API key at [OpenRouter Keys Dashboard](https://openrouter.ai/keys)

2. **Environment Variable Not Loaded**
   - The API key in `.env.local` is not being properly loaded
   - Solution: Verify the environment variable format in `.env.local`:
     ```
     OPENROUTER_API_KEY=sk-or-v1-your-key-here
     ```

3. **Rate Limit Exceeded**
   - Free tier accounts have limited usage
   - Solution: Monitor your usage or upgrade your account

## Testing API Connection

### Using the API Test Page

Open `api-test.html` in your browser and click the "Test API Connection" button to diagnose API issues.

### Using cURL

```bash
curl -s -H "Authorization: Bearer YOUR_API_KEY" https://openrouter.ai/api/v1/models
```

If successful, you'll see a list of available models.

## Implemented Fixes

The following fixes have been implemented to improve reliability:

1. **Hardcoded API Key**: As a temporary measure, the API key is hardcoded in the `openrouterService.ts` file for development purposes.

2. **Retry Logic**: The service now includes exponential backoff retry logic for transient errors.

3. **Improved Error Handling**: Better error messages and logging for debugging API issues.

4. **API Test Button**: A test button in the UI to quickly check API connectivity.

## Changing the AI Model

If you need to use a different model:

1. Update the model name in `constants.ts`:
   ```typescript
   export const OPENROUTER_MODEL = 'alternative-model-name';
   ```

2. Check available free models at [OpenRouter Pricing](https://openrouter.ai/pricing)

## Common Debugging Steps

1. Check browser console for detailed error messages
2. Verify network requests to see the exact HTTP errors
3. Test API key with alternative tools like Postman or cURL
4. Verify the model name is correct and available to your tier

For persistent issues, contact OpenRouter support or consider alternative AI providers.
