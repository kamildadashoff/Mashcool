import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface AICostLog {
  model: string;
  inputTokens: number;
  outputTokens: number;
  costUSD: number;
  latencyMs: number;
  retries: number;
}

// Estimates token usage and cost for Gemini 3.7 Flash
export function calculateAICost(inputTokens: number, outputTokens: number, model = 'gemini-3.7-flash'): number {
  // Approximate pricing: $0.15 per 1M input tokens, $0.60 per 1M output tokens
  const inputCost = (inputTokens / 1_000_000) * 0.15;
  const outputCost = (outputTokens / 1_000_000) * 0.60;
  return Number((inputCost + outputCost).toFixed(6));
}
