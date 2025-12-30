# Volcano Engine API Configuration Guide

## Problem
The "Failed to recognize image" error is likely caused by missing or incorrect API configuration.

## Possible Causes
1. **Missing API Key**: No Volcano Engine API key configured
2. **Incorrect Endpoint**: Wrong API endpoint URL
3. **Invalid Model ID**: Incorrect model ID for image recognition
4. **Network Issues**: Cannot connect to the API service
5. **Image Issues**: Unsupported image format or size

## Solution

### 1. Configure API Key
Add your Volcano Engine API key to the `.env` file:

```env
# Volcano Engine API Configuration
VITE_VOLCANO_API_KEY=your-api-key-here
VITE_VOLCANO_ENDPOINT=https://ark.cn-beijing.volces.com/api/v3/responses
VITE_VOLCANO_MODEL_ID=mushroom-identification-v1
```

### 2. Update the API Client
Modify `src/integrations/volcano/client.ts` to use environment variables:

```typescript
constructor(options: VolcanoAPIOptions = {}) {
  this.endpoint = options.endpoint || import.meta.env.VITE_VOLCANO_ENDPOINT || 'https://ark.cn-beijing.volces.com/api/v3/responses';
  this.apiKey = options.apiKey || import.meta.env.VITE_VOLCANO_API_KEY || '';
  this.defaultModelId = options.modelId || import.meta.env.VITE_VOLCANO_MODEL_ID || 'mushroom-identification-v1';
  this.defaultKeywordModelId = options.modelId || import.meta.env.VITE_VOLCANO_KEYWORD_MODEL_ID || 'keyword-extraction-v1';
}
```

### 3. Restart Development Server
After updating the `.env` file, restart the development server:

```bash
npm run dev
```

## Testing
1. Open the application in your browser
2. Navigate to the Discover page
3. Click "SCAN SPECIES" button
4. Upload an image of a mushroom
5. Check the browser console for detailed logs

## Error Diagnostics
The application now provides detailed logs in the browser console:
- Check Network tab for API request/response
- Check Console tab for step-by-step processing logs

If you continue to experience issues, please provide the following information:
- Browser console logs
- API response details (from Network tab)
- Image format and size
- Volcano Engine API key status