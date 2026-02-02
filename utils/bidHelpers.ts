/**
 * Bid Helper Utilities
 * 
 * Helper functions for bid processing and display logic.
 */

import { INSPIRATION_CATEGORIES } from '../constants';
import { getAgentTheme, AgentTheme } from './agentThemes';

/**
 * Get emoji for moat/feature badge based on feature description
 */
export function getMoatEmoji(moat: string, theme: AgentTheme): string {
  const moatLower = moat.toLowerCase();
  
  // Feature-based emojis
  if (moatLower.includes('authentic') || moatLower.includes('real deal') || moatLower.includes('original')) {
    return '✨';
  }
  if (moatLower.includes('protein') || moatLower.includes('powerhouse') || moatLower.includes('strength')) {
    return '💪';
  }
  if (moatLower.includes('crave') || moatLower.includes('deals') || moatLower.includes('value')) {
    return '🔥';
  }
  if (moatLower.includes('speed') || moatLower.includes('fast') || moatLower.includes('quick')) {
    return '⚡';
  }
  if (moatLower.includes('fresh') || moatLower.includes('market') || moatLower.includes('local')) {
    return '🌿';
  }
  if (moatLower.includes('quality') || moatLower.includes('premium') || moatLower.includes('elite')) {
    return '⭐';
  }
  if (moatLower.includes('flame') || moatLower.includes('grilled') || moatLower.includes('fire')) {
    return '🔥';
  }
  if (moatLower.includes('custom') || moatLower.includes('personalized')) {
    return '🎯';
  }
  if (moatLower.includes('icon') || moatLower.includes('legend') || moatLower.includes('classic')) {
    return '🏆';
  }
  
  // Fallback to theme emoji
  return theme.emoji;
}

/**
 * Get food image URL based on restaurant name/category
 */
export function getFoodImage(agentName: string): string {
  const name = agentName.toLowerCase();
  
  // Map restaurant names to food categories
  if (name.includes('pizza') || name.includes('regina') || name.includes('domino')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'pizza')?.img || '';
  }
  if (name.includes('burger') || name.includes('mcdonald') || name.includes('wendy') || name.includes('king') || name.includes('tasty')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'burger')?.img || '';
  }
  if (name.includes('taco') || name.includes('chipotle') || name.includes('anna') || name.includes('taqueria')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'tacos')?.img || '';
  }
  if (name.includes('burrito') || name.includes('mexican')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'burrito')?.img || '';
  }
  if (name.includes('sushi') || name.includes('poke')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'sushi')?.img || '';
  }
  if (name.includes('ramen')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'ramen')?.img || '';
  }
  if (name.includes('lobster') || name.includes('sea') || name.includes('oyster') || name.includes('fish') || name.includes('legal') || name.includes('catch') || name.includes('neptune')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'lobster')?.img || '';
  }
  if (name.includes('chick') || name.includes('wing') || name.includes('friedchicken')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'wings')?.img || '';
  }
  if (name.includes('coffee') || name.includes('starbucks') || name.includes('dunkin') || name.includes('cafe') || name.includes('flour')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'coffee')?.img || '';
  }
  if (name.includes('donut') || name.includes('bakery')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'donuts')?.img || '';
  }
  if (name.includes('thai')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'thai')?.img || '';
  }
  if (name.includes('dim sum') || name.includes('asian')) {
    return INSPIRATION_CATEGORIES.find(c => c.id === 'dimsum')?.img || '';
  }
  
  // Default to first category image
  return INSPIRATION_CATEGORIES[0]?.img || '';
}

/**
 * Get brand logo URL based on restaurant name
 * Returns null if no logo is available (fallback to initials)
 */
export function getBrandLogo(agentName: string): string | null {
  const name = agentName.toLowerCase().trim();
  
  // Map restaurant names to logo URLs using Clearbit Logo API (free, no API key needed)
  const logoMap: Record<string, string> = {
    // Fast food chains
    "mcdonald's": 'https://logo.clearbit.com/mcdonalds.com',
    "mcdonalds": 'https://logo.clearbit.com/mcdonalds.com',
    "starbucks": 'https://logo.clearbit.com/starbucks.com',
    "chick-fil-a": 'https://logo.clearbit.com/chick-fil-a.com',
    "chickfila": 'https://logo.clearbit.com/chick-fil-a.com',
    "taco bell": 'https://logo.clearbit.com/tacobell.com',
    "tacobell": 'https://logo.clearbit.com/tacobell.com',
    "wendy's": 'https://logo.clearbit.com/wendys.com',
    "wendys": 'https://logo.clearbit.com/wendys.com',
    "burger king": 'https://logo.clearbit.com/burgerking.com',
    "burgerking": 'https://logo.clearbit.com/burgerking.com',
    "dunkin'": 'https://logo.clearbit.com/dunkindonuts.com',
    "dunkin": 'https://logo.clearbit.com/dunkindonuts.com',
    "dunkin donuts": 'https://logo.clearbit.com/dunkindonuts.com',
    "subway": 'https://logo.clearbit.com/subway.com',
    "domino's": 'https://logo.clearbit.com/dominos.com',
    "dominos": 'https://logo.clearbit.com/dominos.com',
    "chipotle": 'https://logo.clearbit.com/chipotle.com',
    
    // Boston restaurants
    "legal sea foods": 'https://logo.clearbit.com/legalseafoods.com',
    "legal seafoods": 'https://logo.clearbit.com/legalseafoods.com',
    "neptune oyster": null, // Local restaurant, no logo available
    "regina pizzeria": null, // Local restaurant
    "tasty burger": null, // Local restaurant
    "anna's taqueria": null, // Local restaurant
    "annas taqueria": null,
    "flour bakery": null, // Local restaurant
  };
  
  // Try exact match first
  if (logoMap[name]) {
    return logoMap[name];
  }
  
  // Try partial matches
  for (const [key, logo] of Object.entries(logoMap)) {
    if (name.includes(key) || key.includes(name)) {
      return logo;
    }
  }
  
  // Try common brand name patterns
  if (name.includes('mcdonald')) return logoMap["mcdonald's"];
  if (name.includes('starbuck')) return logoMap["starbucks"];
  if (name.includes('chick') && name.includes('fil')) return logoMap["chick-fil-a"];
  if (name.includes('taco') && name.includes('bell')) return logoMap["taco bell"];
  if (name.includes('wendy')) return logoMap["wendy's"];
  if (name.includes('burger') && name.includes('king')) return logoMap["burger king"];
  if (name.includes('dunkin')) return logoMap["dunkin'"];
  if (name.includes('subway')) return logoMap["subway"];
  if (name.includes('domino')) return logoMap["domino's"];
  if (name.includes('chipotle')) return logoMap["chipotle"];
  if (name.includes('legal') && name.includes('sea')) return logoMap["legal sea foods"];
  
  // No logo found, return null to use initials fallback
  return null;
}
