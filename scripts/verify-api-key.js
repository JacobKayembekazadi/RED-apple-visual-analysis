#!/usr/bin/env node

// This script validates that the OpenRouter API key is properly set
// and attempts a simple test request to check its validity

import { config } from 'dotenv';
import https from 'https';

// Wrap everything in an async main function
async function main() {
  try {
    // Load environment variables from .env.local
    config({ path: '.env.local' });

// Read the API key from environment variables
const apiKey = process.env.OPENROUTER_API_KEY;

// For debugging purposes, let's log the available environment variables (without showing values)
console.log('Available environment variables:', Object.keys(process.env).join(', '));

if (!apiKey) {
  console.error('❌ Error: OPENROUTER_API_KEY is not set in .env.local');
  console.log('Please ensure you have a .env.local file with OPENROUTER_API_KEY=your_api_key');
  process.exit(1);
}

if (!apiKey.startsWith('sk-or-')) {
  console.warn('⚠️  Warning: Your OpenRouter API key doesn\'t start with "sk-or-"');
  console.log('This may indicate an incorrect API key format. OpenRouter keys typically start with "sk-or-"');
}

console.log('🔑 API key found in environment variables');
console.log(`🔒 API key format check: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

// Make a simple request to check the API key validity
const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/models',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
};

console.log('🔄 Testing API key by making a request to OpenRouter...');

// Use async/await with fetch instead of raw https module
try {
  console.log('🔄 Testing API key by making a request to OpenRouter...');
  
  // Add a simple fallback for testing
  const testKey = apiKey || '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';
  
  // Instead of using raw https module, let's use the fetch API which is available in Node.js
  const response = await fetch('https://openrouter.ai/api/v1/models', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${testKey}`
    }
  });
  
  console.log(`🌐 Response status code: ${response.status}`);
  
  if (response.status === 200) {
    console.log('✅ API key is valid and working!');
    // Get a list of available models for informational purposes
    const data = await response.json();
    console.log(`📋 Available models: ${data.data.map(model => model.id).join(', ')}`);
    process.exit(0);
  } else if (response.status === 401) {
    console.error('❌ API key is invalid or expired. Please check your OpenRouter account.');
    const errorData = await response.text();
    console.error('Error details:', errorData);
    process.exit(1);
  } else {
    console.warn(`⚠️ Received status ${response.status}. The API key might be valid, but there could be other issues.`);
    const responseData = await response.text();
    console.log('Response body:', responseData);
  }
} catch (e) {
  console.error(`❌ API request error: ${e.message}`);
  process.exit(1);
}
}

// Call the main function
main();
