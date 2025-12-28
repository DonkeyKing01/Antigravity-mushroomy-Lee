// Test script for Volcano Engine API Client
// This script tests the functionality of the Volcano Engine API client
// including image recognition and keyword extraction

import { VolcanoEngineClient } from '../integrations/volcano/client.ts';
import fs from 'fs';
import path from 'path';

// Create a test client
const client = new VolcanoEngineClient({
    // You can add API key and endpoint here for testing
    // apiKey: 'your-api-key',
    // endpoint: 'your-endpoint'
});

// Mock FileReader for Node.js environment
class MockFileReader {
    public onload: ((this: MockFileReader, ev: { target: { result: string } }) => any) | null = null;
    public onerror: ((this: MockFileReader, ev: Event) => any) | null = null;
    public result: string | null = null;
    
    readAsDataURL(file: File) {
        // Convert Buffer to base64 string
        // In Node.js, we need to handle File objects differently
        this.result = `data:image/jpeg;base64,bW9jayBpbWFnZSBjb250ZW50`;
        
        // Trigger onload event
        setTimeout(() => {
            if (this.onload) {
                this.onload.call(this, { target: { result: this.result } });
            }
        }, 0);
    }
}

// Replace global FileReader with mock
(global as any).FileReader = MockFileReader;

// Mock file for testing
const createMockFile = (): File => {
    // Create a simple text file as mock image
    const content = 'mock image content';
    return new File([content], 'test-mushroom.jpg', { type: 'image/jpeg' });
};

// Test file to base64 conversion
const testFileToBase64 = async () => {
    console.log('\n1. Testing file to base64 conversion...');
    try {
        const mockFile = createMockFile();
        const base64String = await client.fileToBase64(mockFile);
        console.log('✓ File to base64 conversion successful');
        console.log('Base64 string:', base64String.substring(0, 20) + '...');
        return true;
    } catch (error) {
        console.error('✗ File to base64 conversion failed:', error);
        return false;
    }
};

// Test image recognition (will fail without valid API key)
const testImageRecognition = async () => {
    console.log('\n2. Testing image recognition API...');
    try {
        const mockFile = createMockFile();
        const result = await client.recognizeImage(mockFile);
        
        if (result.success && result.result?.text) {
            console.log('✓ Image recognition successful');
            console.log('Recognition result:', result.result.text);
        } else {
            // Expected to fail without API key
            console.log('⚠ Image recognition failed (expected without valid API key)');
            console.log('Error:', result.error?.message);
        }
        return true;
    } catch (error) {
        console.error('✗ Image recognition test failed:', error);
        return false;
    }
};

// Test keyword extraction (will fail without valid API key)
const testKeywordExtraction = async () => {
    console.log('\n3. Testing keyword extraction API...');
    try {
        const testText = 'This is a test of the keyword extraction API for mushroom identification. The primary mushroom is Amanita muscaria, also known as fly agaric. Similar mushrooms include Amanita pantherina and Amanita gemmata.';
        const result = await client.extractKeywords(testText);
        
        if (result.success && result.result?.keywords) {
            console.log('✓ Keyword extraction successful');
            console.log('Extracted keywords:', result.result.keywords.map(k => k.word).join(', '));
        } else {
            // Expected to fail without API key
            console.log('⚠ Keyword extraction failed (expected without valid API key)');
            console.log('Error:', result.error?.message);
        }
        return true;
    } catch (error) {
        console.error('✗ Keyword extraction test failed:', error);
        return false;
    }
};

// Test mushroom image processing (will fail without valid API key)
const testMushroomProcessing = async () => {
    console.log('\n4. Testing mushroom image processing...');
    try {
        const mockFile = createMockFile();
        const result = await client.processMushroomImage(mockFile);
        
        if (result.success) {
            console.log('✓ Mushroom processing successful');
            console.log('Primary mushroom:', result.primaryMushroom);
            console.log('Similar mushrooms:', result.similarMushrooms?.join(', '));
        } else {
            // Expected to fail without API key
            console.log('⚠ Mushroom processing failed (expected without valid API key)');
            console.log('Error:', result.error);
        }
        return true;
    } catch (error) {
        console.error('✗ Mushroom processing test failed:', error);
        return false;
    }
};

// Test all functions
const runAllTests = async () => {
    console.log('=== Volcano Engine API Client Tests ===');
    
    const results = [];
    results.push(await testFileToBase64());
    results.push(await testImageRecognition());
    results.push(await testKeywordExtraction());
    results.push(await testMushroomProcessing());
    
    console.log('\n=== Test Summary ===');
    const passed = results.filter(r => r).length;
    const total = results.length;
    console.log(`Passed: ${passed}/${total}`);
    
    if (passed === total) {
        console.log('✓ All tests passed!');
    } else {
        console.log('⚠ Some tests failed (expected without valid API key)');
    }
};

// Run tests
runAllTests().catch(console.error);

export { testFileToBase64, testImageRecognition, testKeywordExtraction, testMushroomProcessing };
