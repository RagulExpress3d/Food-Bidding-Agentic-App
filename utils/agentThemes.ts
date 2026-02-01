/**
 * Agent Theme Utilities
 * 
 * Provides theme configuration for restaurant agents based on their name/category.
 * Used for consistent styling across bid displays and tracking components.
 */

export interface AgentTheme {
  emoji: string;
  bg: string;
  border: string;
  hoverBorder: string;
  accent: string;
  tagBg: string;
  innerBg: string;
  buttonBg: string;
  buttonBorder: string;
  buttonHoverBg: string;
  buttonText: string;
}

/**
 * Returns theme configuration for an agent based on their name.
 * Matches restaurant categories to appropriate visual themes.
 * 
 * @param name - The agent/restaurant name
 * @returns Theme configuration object with emoji, colors, and styling classes
 */
export function getAgentTheme(name: string): AgentTheme {
  const n = name.toLowerCase();
  
  // Pizza Theme
  if (n.includes('pizza') || n.includes('regina') || n.includes('domino')) {
    return {
      emoji: '🍕',
      bg: 'bg-red-50',
      border: 'border-red-200',
      hoverBorder: 'hover:border-red-500',
      accent: 'text-red-600',
      tagBg: 'bg-red-600',
      innerBg: 'bg-orange-100/30',
      buttonBg: 'bg-red-500',
      buttonBorder: 'border-red-600',
      buttonHoverBg: 'hover:bg-red-600',
      buttonText: 'text-white'
    };
  }
  
  // Seafood Theme
  if (n.includes('sea') || n.includes('oyster') || n.includes('fish') || n.includes('legal') || n.includes('catch') || n.includes('lobster')) {
    return {
      emoji: '🦞',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      hoverBorder: 'hover:border-cyan-500',
      accent: 'text-cyan-700',
      tagBg: 'bg-cyan-700',
      innerBg: 'bg-cyan-100/40',
      buttonBg: 'bg-cyan-500',
      buttonBorder: 'border-cyan-600',
      buttonHoverBg: 'hover:bg-cyan-600',
      buttonText: 'text-white'
    };
  }
  
  // Burger/Fast Food Theme
  if (n.includes('burger') || n.includes('mcdonald') || n.includes('wendy') || n.includes('king') || n.includes('tasty')) {
    return {
      emoji: '🍔',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      hoverBorder: 'hover:border-amber-500',
      accent: 'text-amber-800',
      tagBg: 'bg-amber-800',
      innerBg: 'bg-yellow-100/40',
      buttonBg: 'bg-amber-600',
      buttonBorder: 'border-amber-700',
      buttonHoverBg: 'hover:bg-amber-700',
      buttonText: 'text-white'
    };
  }
  
  // Mexican Theme
  if (n.includes('taqueria') || n.includes('taco') || n.includes('chipotle') || n.includes('mexican') || n.includes('burrito') || n.includes('anna') || n.includes('pelón')) {
    return {
      emoji: '🌮',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-500',
      accent: 'text-emerald-700',
      tagBg: 'bg-emerald-700',
      innerBg: 'bg-emerald-100/30',
      buttonBg: 'bg-emerald-500',
      buttonBorder: 'border-emerald-600',
      buttonHoverBg: 'hover:bg-emerald-600',
      buttonText: 'text-white'
    };
  }
  
  // Coffee/Bakery Theme
  if (n.includes('dunkin') || n.includes('starbucks') || n.includes('flour') || n.includes('coffee') || n.includes('donut') || n.includes('bakery') || n.includes('cafe')) {
    return {
      emoji: '🍩',
      bg: 'bg-stone-50',
      border: 'border-stone-200',
      hoverBorder: 'hover:border-stone-500',
      accent: 'text-stone-700',
      tagBg: 'bg-stone-700',
      innerBg: 'bg-stone-200/40',
      buttonBg: 'bg-stone-600',
      buttonBorder: 'border-stone-700',
      buttonHoverBg: 'hover:bg-stone-700',
      buttonText: 'text-white'
    };
  }
  
  // Asian/Fusion Theme
  if (n.includes('sushi') || n.includes('ramen') || n.includes('asian') || n.includes('poke') || n.includes('thai') || n.includes('dim sum') || n.includes('udon') || n.includes('yume')) {
    return {
      emoji: '🥢',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      hoverBorder: 'hover:border-rose-500',
      accent: 'text-rose-700',
      tagBg: 'bg-rose-700',
      innerBg: 'bg-rose-100/30',
      buttonBg: 'bg-rose-500',
      buttonBorder: 'border-rose-600',
      buttonHoverBg: 'hover:bg-rose-600',
      buttonText: 'text-white'
    };
  }
  
  // Chicken Theme
  if (n.includes('chick') || n.includes('wing')) {
    return {
      emoji: '🍗',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      hoverBorder: 'hover:border-orange-500',
      accent: 'text-orange-700',
      tagBg: 'bg-orange-700',
      innerBg: 'bg-orange-100/30',
      buttonBg: 'bg-orange-500',
      buttonBorder: 'border-orange-600',
      buttonHoverBg: 'hover:bg-orange-600',
      buttonText: 'text-white'
    };
  }
  
  // Default/Generic
  return {
    emoji: '🍱',
    bg: 'bg-white',
    border: 'border-dd-light',
    hoverBorder: 'hover:border-dd-orange',
    accent: 'text-dd-dark',
    tagBg: 'bg-emerald-500',
    innerBg: 'bg-dd-light',
    buttonBg: 'bg-dd-orange',
    buttonBorder: 'border-dd-dark',
    buttonHoverBg: 'hover:bg-dd-dark',
    buttonText: 'text-white'
  };
}
