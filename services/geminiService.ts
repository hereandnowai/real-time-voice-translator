
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Safely access process.env.API_KEY
const API_KEY = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn(
    "Gemini API Key (API_KEY) is not set in the environment variables. Translation functionality will be disabled. Please ensure the API_KEY is configured."
  );
}

const MODEL_NAME = "gemini-2.5-flash-preview-04-17";

export const translateText = async (
  text: string,
  sourceLanguageName: string,
  targetLanguageName: string
): Promise<string> => {
  if (!ai) {
    return Promise.reject(
      new Error("Gemini API client not initialized. API Key may be missing or invalid.")
    );
  }

  const prompt = `Translate the following text from ${sourceLanguageName} to ${targetLanguageName}. Provide only the translated text, without any additional explanations, introductory phrases, or context. For example, if translating "Hello" from English to Spanish, the output should be just "Hola".\n\nText to translate:\n"${text}"`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
    });
    
    const translated = response.text;
    
    if (typeof translated === 'string') {
        return translated.trim();
    } else {
      // According to documentation, response.text should be a string.
      // If it's not, it's an unexpected state or the API contract changed.
      console.error("Translation response.text was not a string:", translated);
      throw new Error("Translation response was not in the expected text format.");
    }

  } catch (error) {
    console.error("Error translating text with Gemini:", error);
    if (error instanceof Error) {
        // Check for specific API key related messages, which might vary
        if (error.message.includes('API key not valid') || 
            error.message.includes('API_KEY_INVALID') || 
            error.message.includes('permission denied') || // Broader check
            (error.message.includes('Quota') && error.message.includes('API key'))) { // Quota issues often tied to key
            throw new Error("Invalid or incorrectly configured Gemini API Key. Please check your configuration and ensure it has the necessary permissions and quota.");
        }
        throw new Error(`Gemini API error: ${error.message}`);
    }
    throw new Error("An unknown error occurred during translation with the Gemini API.");
  }
};