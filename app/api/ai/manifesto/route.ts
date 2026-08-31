import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const { topic } = await request.json();

  if (!topic || typeof topic !== 'string') {
    return NextResponse.json({ error: 'MISSING_TOPIC' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, aggressive, 1-sentence brutalist manifesto about ${topic}. Use only uppercase. Be blunt and confident. No fluff.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
        // Added thinkingConfig as required by guidelines when using maxOutputTokens
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 50 },
      },
    });

    return NextResponse.json({ statement: response.text.trim() });
  } catch (error) {
    console.error('Gemini failed:', error);
    return NextResponse.json({ error: 'GENERATION_FAILED' }, { status: 502 });
  }
}
