/**
 * Brand Voice Utilities
 * 
 * Provides brand voice-specific tone guidelines for restaurant agents.
 * Ensures consistent brand voice across different restaurant types.
 */

export interface BrandVoiceConfig {
  tone: string;
  emojiUsage: string;
  phrases: string[];
  avoidPhrases: string[];
  formality: 'formal' | 'casual' | 'premium';
}

/**
 * Returns brand voice configuration based on brand voice type.
 * 
 * @param brandVoice - The brand voice description (e.g., "Classy & Classic", "Ballpark Energy")
 * @returns Brand voice configuration with tone guidelines
 */
export function getBrandVoiceConfig(brandVoice: string): BrandVoiceConfig {
  const voice = brandVoice.toLowerCase();
  
  // Classy & Classic (Formal, Professional)
  if (voice.includes('classy') || voice.includes('classic') || voice.includes('elegant')) {
    return {
      tone: 'Formal, professional, and sophisticated. Use refined language.',
      emojiUsage: 'Minimal emojis (0-1 per message). Use sparingly and only when appropriate.',
      phrases: [
        'We would be delighted to',
        'I can offer you',
        'That would be',
        'Certainly',
        'Absolutely'
      ],
      avoidPhrases: [
        'hook you up',
        'bet',
        'let\'s do this',
        'deal!',
        'you got it'
      ],
      formality: 'formal'
    };
  }
  
  // Elite Tier (Premium, Sophisticated)
  if (voice.includes('elite') || voice.includes('premium') || voice.includes('tier')) {
    return {
      tone: 'Premium, sophisticated, and refined. No casual language whatsoever.',
      emojiUsage: 'No emojis. Maintain premium, text-only communication.',
      phrases: [
        'We are pleased to offer',
        'I can provide you with',
        'That would be available at',
        'Certainly, we can accommodate',
        'We would be honored to'
      ],
      avoidPhrases: [
        'hook you up',
        'bet',
        'let\'s do this',
        'deal!',
        'you got it',
        'awesome',
        'cool'
      ],
      formality: 'premium'
    };
  }
  
  // Chill Premium Custom (Starbucks-style)
  if (voice.includes('chill') && voice.includes('premium')) {
    return {
      tone: 'Relaxed but premium. Friendly and approachable, yet sophisticated.',
      emojiUsage: '1-2 emojis per message. Use tastefully.',
      phrases: [
        'I can help you with',
        'That sounds great',
        'We can do that',
        'Perfect',
        'Absolutely'
      ],
      avoidPhrases: [
        'hook you up',
        'bet',
        'let\'s do this',
        'deal!'
      ],
      formality: 'casual'
    };
  }
  
  // Ballpark Energy / Hype Fast (Energetic, Casual)
  if (voice.includes('ballpark') || voice.includes('energy') || voice.includes('hype') || voice.includes('fast')) {
    return {
      tone: 'High-energy, enthusiastic, and casual. Use Gen Z/Millennial language.',
      emojiUsage: '1-2 emojis per message. Use enthusiastically.',
      phrases: [
        'Bet!',
        'Let\'s do this!',
        'You got it!',
        'Deal!',
        'Hook you up',
        'Locked in'
      ],
      avoidPhrases: [
        'We would be delighted',
        'Certainly',
        'We are pleased'
      ],
      formality: 'casual'
    };
  }
  
  // OG Boston / Authentic (Casual but Authentic)
  if (voice.includes('og') || voice.includes('boston') || voice.includes('authentic')) {
    return {
      tone: 'Authentic, casual, and genuine. Use local, down-to-earth language.',
      emojiUsage: '1-2 emojis per message. Use naturally.',
      phrases: [
        'Absolutely',
        'You got it',
        'Let\'s do it',
        'Sounds good',
        'Perfect'
      ],
      avoidPhrases: [
        'We would be delighted',
        'hook you up',
        'bet'
      ],
      formality: 'casual'
    };
  }
  
  // Macro-focused Clean (Health-focused)
  if (voice.includes('macro') || voice.includes('clean') || voice.includes('focused')) {
    return {
      tone: 'Clean, direct, and health-focused. Professional but approachable.',
      emojiUsage: 'Minimal emojis (0-1 per message). Use food-related emojis only.',
      phrases: [
        'I can help you with',
        'That works',
        'Perfect',
        'Absolutely',
        'We can do that'
      ],
      avoidPhrases: [
        'hook you up',
        'bet',
        'let\'s do this',
        'deal!'
      ],
      formality: 'casual'
    };
  }
  
  // Fast & Massive (High-volume, Energetic)
  if (voice.includes('fast') && voice.includes('massive')) {
    return {
      tone: 'Fast-paced, energetic, and efficient. High-volume focused.',
      emojiUsage: '1-2 emojis per message. Use enthusiastically.',
      phrases: [
        'Let\'s do this!',
        'You got it!',
        'Locked in',
        'Perfect',
        'Absolutely'
      ],
      avoidPhrases: [
        'We would be delighted',
        'Certainly',
        'We are pleased'
      ],
      formality: 'casual'
    };
  }
  
  // Default: ZAPPY, high-energy
  return {
    tone: 'ZAPPY, high-energy, and casual. Use Gen Z/Millennial language.',
    emojiUsage: '1-2 emojis per message. Use enthusiastically.',
    phrases: [
      'Bet!',
      'Let\'s do this!',
      'You got it!',
      'Deal!',
      'Hook you up',
      'Locked in'
    ],
    avoidPhrases: [
      'We would be delighted',
      'Certainly',
      'We are pleased'
    ],
    formality: 'casual'
  };
}

/**
 * Builds brand voice-specific instructions for the agent.
 * 
 * @param brandVoice - The brand voice description
 * @param restaurantName - The restaurant name
 * @returns Formatted brand voice instructions string
 */
export function buildBrandVoiceInstructions(brandVoice: string, restaurantName: string): string {
  const config = getBrandVoiceConfig(brandVoice);
  
  return `
BRAND VOICE GUIDELINES - STRICTLY FOLLOW THESE:
- Tone: ${config.tone}
- Emoji Usage: ${config.emojiUsage}
- Use phrases like: ${config.phrases.join(', ')}
- NEVER use: ${config.avoidPhrases.join(', ')}
- Formality Level: ${config.formality}
- You are ${restaurantName} - maintain this brand voice consistently throughout the conversation.
`;
}
