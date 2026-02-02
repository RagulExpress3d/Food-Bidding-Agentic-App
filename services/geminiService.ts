import { GoogleGenAI, Type } from "@google/genai";
import { UserConstraints, Bid } from "../types";
import { TIER_1_AGENTS, BOSTON_20_AGENTS } from "../constants";

const getApiKey = (): string => {
  // Runtime: Read from window.__ENV__ (injected by Cloud Run)
  // Development: Read from process.env (Vite)
  // Check window.__ENV__ first (runtime injection)
  const runtimeKey = (typeof window !== 'undefined' && (window as any).__ENV__?.GEMINI_API_KEY) || '';
  // Fallback to process.env (build-time, Vite)
  const buildTimeKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  const key = (runtimeKey || buildTimeKey).trim();
  
  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && !key) {
    console.warn('⚠️ API Key not found:', {
      hasWindow: typeof window !== 'undefined',
      hasWindowEnv: typeof window !== 'undefined' && !!(window as any).__ENV__,
      windowEnvKeys: typeof window !== 'undefined' && (window as any).__ENV__ ? Object.keys((window as any).__ENV__) : [],
      hasProcessEnv: !!process.env.GEMINI_API_KEY || !!process.env.API_KEY
    });
  }
  
  return key;
};

let ai: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  // Always get fresh API key (don't cache the key check)
  const key = getApiKey();
  if (!key) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to a .env or .env.local file (dev) or Cloud Run secrets (prod). Get a key at https://aistudio.google.com/apikey'
    );
  }
  
  // Only create new client if we don't have one or if key changed
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: key });
  }
  
  return ai;
}

export async function generateBids(constraints: UserConstraints): Promise<Bid[]> {
  const allAgents = [...TIER_1_AGENTS, ...BOSTON_20_AGENTS];
  const client = getClient();

  const prompt = `
    Act as the FeastBid OS. A user in Boston has the following request:
    Duration: ${constraints.duration} days
    Quantity per order: ${constraints.quantity}
    Budget per item: $${constraints.budgetCap}
    Dietary Tags: ${constraints.dietaryTags.join(', ')}
    Item Preference: ${constraints.itemPref}

    From the following agent list, select exactly 3 agents that best match the preference and budget.
    For each agent, generate a competitive bid.
    
    Rules:
    1. The 'bidPrice' must be the UNIT PRICE per item.
    2. Use real Boston-specific menu pricing (e.g., $14.95, $28.50).
    3. Factor in market price for seafood if applicable.
    4. The 'bidPrice' must be slightly lower than 'realPrice' to show value.
    5. If Duration is > 7 days, offer a subscription-style 'Offer'.
    6. Maintain the Brand Voice.
    7. Include a 4-step 'statusTimeline' specific to the restaurant's operations.
    8. Generate an 'expertTip' for the post-order delight.
    9. Generate a 'bonusOffer' (e.g., "Free Side of Guac", "Extra Garlic Knots", "Double Points") that the user can claim.

    Agent Database: ${JSON.stringify(allAgents)}
  `;

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              agentName: { type: Type.STRING },
              neighborhood: { type: Type.STRING },
              offer: { type: Type.STRING },
              moat: { type: Type.STRING },
              realPrice: { type: Type.NUMBER },
              bidPrice: { type: Type.NUMBER },
              dietaryCheck: { type: Type.STRING },
              brandVoice: { type: Type.STRING },
              statusTimeline: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              expertTip: { type: Type.STRING },
              bonusOffer: { type: Type.STRING }
            },
            required: ["agentName", "neighborhood", "offer", "moat", "realPrice", "bidPrice", "dietaryCheck", "brandVoice", "statusTimeline", "expertTip", "bonusOffer"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('API key') || message.includes('401') || message.includes('403')) {
      throw new Error('Invalid or missing Gemini API key. Check .env has GEMINI_API_KEY set. Get a key at https://aistudio.google.com/apikey');
    }
    if (message.includes('quota') || message.includes('429')) {
      throw new Error('Gemini API rate limit reached. Try again in a moment.');
    }
    throw new Error(`Bids could not be generated: ${message}`);
  }
}
