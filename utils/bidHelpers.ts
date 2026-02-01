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
