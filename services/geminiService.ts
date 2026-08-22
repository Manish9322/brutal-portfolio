
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateBrutalistStatement(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a short, aggressive, 1-sentence brutalist manifesto about ${topic}. Use only uppercase. Be blunt and confident. No fluff.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
        // Added thinkingConfig as required by guidelines when using maxOutputTokens
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini failed:", error);
    return "SYSTEM ERROR: FAILED TO GENERATE MANIFESTO.";
  }
}
