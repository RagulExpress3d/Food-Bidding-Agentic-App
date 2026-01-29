
import { GoogleGenAI, Type } from "@google/genai";
import { UserConstraints, Bid } from "../types";
import { TIER_1_AGENTS, BOSTON_20_AGENTS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateBids(constraints: UserConstraints): Promise<Bid[]> {
  const allAgents = [...TIER_1_AGENTS, ...BOSTON_20_AGENTS];
  
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

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
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
}
