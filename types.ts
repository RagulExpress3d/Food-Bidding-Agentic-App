
export type Step = 'INSPIRATION' | 'FORM' | 'BIDDING' | 'CHECKOUT' | 'TRACKING' | 'NEGOTIATION';

export interface UserConstraints {
  duration: 'single' | '7' | '14' | '30';
  budgetCap: number;
  dietaryTags: string[];
  itemPref: string;
  quantity: number;
  location?: string;
}

export interface Bid {
  agentName: string;
  neighborhood: string;
  offer: string;
  moat: string;
  realPrice: number;
  bidPrice: number;
  dietaryCheck: string;
  brandVoice: string;
  statusTimeline: string[];
  expertTip: string;
  bonusOffer: string;
}

export interface Order {
  id: string;
  bid: Bid;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxes: number;
  total: number;
  timestamp: number;
}

export interface Agent {
  name: string;
  category: string;
  voice: string;
  moat: string;
  pricing: 'Value' | 'Moderate' | 'Premium' | 'High';
  neighborhood?: string;
  specialty?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
