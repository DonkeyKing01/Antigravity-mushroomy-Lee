// Volcano Engine API Client for mushroom identification

interface VolcanoAPIOptions {
  endpoint?: string;
  apiKey?: string;
  modelId?: string;
  skipProxy?: boolean; // Temporary option for testing direct API access
}

interface ImageRecognitionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: Array<{
      type: string;
      text?: string;
      image_url?: {
        url: string;
      };
    }>;
  }>;
  max_tokens: number;
}

interface ImageRecognitionResponse {
  success: boolean;
  result?: {
    text: string;
    confidence?: number;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface KeywordExtractionRequest {
  text: string;
  model: string;
  parameters?: {
    top_k?: number;
    [key: string]: any;
  };
}

interface KeywordExtractionResponse {
  success: boolean;
  result?: {
    keywords: {
      word: string;
      score: number;
    }[];
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class VolcanoEngineClient {
  private endpoint: string;
  private apiKey: string;
  private defaultModelId: string;
  private defaultKeywordModelId: string;

  constructor(options: VolcanoAPIOptions = {}) {
    // Check if we're in a Vite environment (browser)
    const isViteEnvironment = typeof import.meta?.env !== 'undefined';
    const isDevelopment = isViteEnvironment ? import.meta.env.DEV : false;
    
    // New API endpoints based on user's specification
    const newEndpoint = 'https://ai-gateway.vei.volces.com/v1/chat/completions';
    const proxyEndpoint = '/api/volcano/v1/chat/completions'; // Updated proxy path
    
    // Use direct endpoint if skipProxy is true, regardless of environment
    if (options.skipProxy) {
      this.endpoint = options.endpoint || newEndpoint;
    } 
    // Explicitly prioritize proxy endpoint in development
    else if (isDevelopment) {
      this.endpoint = options.endpoint 
        || (isViteEnvironment ? (import.meta.env.VITE_VOLCANO_API_ENDPOINT || proxyEndpoint) : proxyEndpoint);
    } else {
      this.endpoint = options.endpoint 
        || (isViteEnvironment ? (import.meta.env.VITE_VOLCANO_API_ENDPOINT || newEndpoint) : newEndpoint);
    }
    
    this.apiKey = options.apiKey 
      || (isViteEnvironment ? import.meta.env.VITE_VOLCANO_API_KEY : '') 
      || 'sk-f05be0ebeeb14b0485149cf96c10b620s18rqu6u0xt7dksi'; // Default to user's new API key
    
    // Validate API key format
    this.validateApiKey();
    
    this.defaultModelId = options.modelId 
      || (isViteEnvironment ? import.meta.env.VITE_VOLCANO_MODEL_ID : '') 
      || 'doubao-seed-1.6'; // Updated to user's model
    this.defaultKeywordModelId = options.modelId 
      || (isViteEnvironment ? import.meta.env.VITE_VOLCANO_KEYWORD_MODEL_ID : '') 
      || 'doubao-seed-1.6'; // Same model for keyword extraction
  }

  /**
   * Validate API key format
   */
  private validateApiKey(): void {
    if (!this.apiKey) {
      console.warn('Volcano Engine API Key is not set. Please configure VITE_VOLCANO_API_KEY in .env file.');
      return;
    }
    
    // Basic format validation (adjust based on Volcano Engine API key format)
    if (this.apiKey === 'your-volcano-engine-api-key-here') {
      console.warn('Volcano Engine API Key is still using the placeholder value. Please replace it with your actual API key.');
      return;
    }
    
    // Check if API key has reasonable length (adjust based on actual format)
    if (this.apiKey.length < 10) {
      console.warn('Volcano Engine API Key appears to be too short. Please check your API key format.');
    }
  }

  /**
   * Set API key for authentication
   */
  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  /**
   * Helper function to parse JSON string with robust error handling and format conversion
   */
  private parseJsonResponse(jsonString: string, topK: number = 5): Array<{ word: string; score: number }> {
    // Helper function to parse score values
    const parseScore = (score: any): number => {
      if (typeof score === 'number') return score;
      if (typeof score === 'string') return parseFloat(score) || 0;
      return parseInt(score, 10) || 0;
    };

    try {
      const parsed = JSON.parse(jsonString);
      
      // Check if response is in the expected keywords array format
      if (parsed.keywords && Array.isArray(parsed.keywords)) {
        return parsed.keywords;
      }
      // New API format: direct array of {keyword, score} objects
      else if (Array.isArray(parsed)) {
        return parsed
          .map(item => ({ word: item.keyword || item.word, score: parseScore(item.score || 0) }))
          .sort((a, b) => b.score - a.score);
      }
      // Old API format: flat JSON object with keyword: score pairs
      else if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return Object.entries(parsed)
          .map(([word, score]) => ({ word, score: parseScore(score) }))
          .sort((a, b) => b.score - a.score);
      }
    } catch (parseError) {
      // If JSON parsing fails, return empty array to trigger fallback logic
      console.warn('Failed to parse keywords JSON:', parseError);
    }

    return [];
  }

  /**
   * Helper function to extract keywords manually from text as fallback
   */
  private extractKeywordsFromText(text: string, topK: number = 5): Array<{ word: string; score: number }> {
    // Strategy 1: Extract from bold markup in recognition text (**羊肚菌**)
    const mushroomNameMatch = text.match(/\*\*(.*?)\*\*/);
    if (mushroomNameMatch && mushroomNameMatch[1]) {
      return [{ word: mushroomNameMatch[1], score: 1.0 }];
    }

    // Strategy 2: Extract meaningful words from text content
    const words = text
      .replace(/[\n\r\t,.!?;:"'()\*]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .filter((word, index, self) => self.indexOf(word) === index) // Remove duplicates
      .slice(0, topK);

    return words.map((word, index) => ({ word, score: (topK - index) / topK }));
  }

  /**
   * Convert image file to data URL string (includes prefix)
   */
  async fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Convert image file to base64 string (deprecated, kept for backward compatibility)
   */
  async fileToBase64(file: File): Promise<string> {
    const dataURL = await this.fileToDataURL(file);
    return dataURL.split(',')[1] || dataURL;
  }

  /**
   * Call Volcano Engine API for image recognition
   */
  async recognizeImage(
    file: File,
    modelId?: string
  ): Promise<ImageRecognitionResponse> {
    try {
      // Convert image to data URL which can be used directly in the API request
      const imageDataURL = await this.fileToDataURL(file);
      
      // Build the new request body format as specified by the user
      const requestBody: ImageRecognitionRequest = {
        model: modelId || this.defaultModelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify the mushroom species in this image, and describe the mushroom\'s features and name in detail'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataURL
                }
              }
            ]
          }
        ],
        max_tokens: 300
      };
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      // Extract text from the new API response format
      let resultText = '';
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        resultText = data.choices[0].message.content;
      }
      
      return {
        success: true,
        result: {
          text: resultText,
          raw: data
        }
      };
    } catch (error) {
      console.error('Image recognition error:', error);
      return {
        success: false,
        error: {
          code: 'RECOGNITION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Extract keywords from text using Volcano Engine API
   * Updated to use the same chat API for keyword extraction
   */
  async extractKeywords(
    text: string,
    modelId?: string,
    topK: number = 5
  ): Promise<KeywordExtractionResponse> {
    try {
      // Build a chat request to extract keywords from the given text
      const requestBody = {
        model: modelId || this.defaultKeywordModelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extract the top ${topK} most relevant mushroom name keywords from the following text, return in JSON format with only keywords and scores, no other explanations:\n\n${text}`
              }
            ]
          }
        ],
        max_tokens: 200
      };

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
    
      // Extract the result text
      let resultText = '';
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        resultText = data.choices[0].message.content;
        
        // Clean up resultText to fix potential formatting issues
        // Remove any leading/trailing whitespace and ensure proper JSON format
        resultText = resultText.trim();
        
        // Remove any markdown formatting like code blocks if present
        if (resultText.startsWith('```json') || resultText.startsWith('```')) {
          resultText = resultText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
        }
      }
      
      // Try to parse JSON from the response text first
      let keywords = this.parseJsonResponse(resultText, topK);
      
      // If JSON parsing fails or returns empty, try to extract keywords manually from resultText
      if (keywords.length === 0 && resultText && resultText.trim().length > 0) {
        keywords = this.extractKeywordsFromText(resultText, topK);
      }
      
      // If still no keywords, try to extract from the original recognition text
      if (keywords.length === 0 && text && text.length > 0) {
        keywords = this.extractKeywordsFromText(text, topK);
      }

      return {
        success: true,
        result: {
          keywords,
          raw: data
        }
      };
    } catch (error) {
      console.error('Keyword extraction error:', error);
      return {
        success: false,
        error: {
          code: 'EXTRACTION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Recognize image and extract keywords in a single API call for better performance
   */
  async recognizeAndExtractKeywords(
    file: File,
    modelId?: string
  ): Promise<{ success: boolean; recognitionText?: string; keywords?: Array<{ word: string; score: number }>; error?: { code: string; message: string }; }> {
    try {
      // Convert image to data URL which can be used directly in the API request
      const imageDataURL = await this.fileToDataURL(file);
      
      // Build the request body to get both recognition and keywords in one call
      const requestBody = {
        model: modelId || this.defaultModelId,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify the mushroom species in this image, and describe the mushroom\'s features and name in detail. Then extract the top 10 most relevant mushroom name keywords with scores and return them in valid JSON format. The JSON should be in this exact format: {"recognitionText": "...", "keywords": [{"word": "...", "score": 1.0}, ...]}. Do not include any other content or explanations outside of this JSON format.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataURL
                }
              }
            ]
          }
        ],
        max_tokens: 500
      };
      
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      
      // Extract the result text
      let resultText = '';
      if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        resultText = data.choices[0].message.content;
      }
      
      // Clean up resultText to fix potential formatting issues
      resultText = resultText.trim();
      
      // Remove any markdown formatting like code blocks if present
      if (resultText.startsWith('```json') || resultText.startsWith('```')) {
        resultText = resultText.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      // Parse the combined JSON response
      const parsedResponse = JSON.parse(resultText);
      
      return {
        success: true,
        recognitionText: parsedResponse.recognitionText || '',
        keywords: parsedResponse.keywords || []
      };
      
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'COMBINED_PROCESSING_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  /**
   * Process mushroom image and extract mushroom names
   */
  async processMushroomImage(file: File): Promise<{
    success: boolean;
    primaryMushroom?: string;
    similarMushrooms?: string[];
    error?: string;
    details?: any;
  }> {
    try {
      // Step 1: Recognize image and extract keywords in a single API call
      const combinedResult = await this.recognizeAndExtractKeywords(file);
      
      if (!combinedResult.success) {
        return {
          success: false,
          error: `Processing failed: ${combinedResult.error?.message || 'Unknown API error'}`,
          details: combinedResult.error
        };
      }
      
      if (!combinedResult.recognitionText) {
        return {
          success: false,
          error: 'Failed to recognize image: No recognition text returned from API',
          details: combinedResult
        };
      }

      // Step 2: Process keywords to identify primary and similar mushrooms
      const keywords = combinedResult.keywords
        ? combinedResult.keywords
            .filter(keyword => keyword.word.length > 2) // Filter out short words
            .sort((a, b) => b.score - a.score) // Sort by relevance
        : [];

      if (keywords.length === 0) {
        return {
          success: false,
          error: 'No mushroom names extracted',
          details: {
            allKeywords: combinedResult.keywords,
            filteredKeywords: keywords
          }
        };
      }

      // Primary mushroom is the highest scoring keyword
      const primaryMushroom = keywords[0].word;
      
      // Similar mushrooms are the next top keywords (excluding the primary one)
      const similarMushrooms = keywords
        .slice(1, 6) // Take next 5
        .map(keyword => keyword.word);

      return {
        success: true,
        primaryMushroom,
        similarMushrooms
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error
      };
    }
  }
}

// Create and export a default instance
export const volcanoClient = new VolcanoEngineClient();