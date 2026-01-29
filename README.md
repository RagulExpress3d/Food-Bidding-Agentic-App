🍔 MunchMatch: The "Reverse-Auction" Food Engine
MunchMatch flips the script on food delivery. Instead of you scrolling through boring menus, you broadcast your cravings, and our Restaurant Agents compete in a live "Battle of the Bids" to win your hunger.

The Motto: Don't chase the food. Let the food chase you.

🎡 What is MunchMatch?
Imagine if DoorDash met The Voice. You are the judge, and the restaurants are the contestants.

You say: "I need a high-protein lunch for under $15. Impress me."

They say:

🍔 McDonald's Agent: "Here's a Double QPC Meal with a lettuce wrap to save carbs!"

🌮 Taco Bell Agent: "Forget that! I've got a Cantina Power Bowl for $3 less!"

🍕 Regina Pizzeria Agent: "I'll give you a slice + salad combo if you order right now!"

🏗️ How It Works (The "Match" Engine)
MunchMatch runs on a Meta-Prompt Operating System built for Gemini 1.5 Pro. It turns the AI into a "Game Show Host" that manages the auction.

Code snippet
graph TD
    User[🤤 User Craving] -->|Broadcasts| Host[The MunchMatch Host]
    
    subgraph "The Contestants (Agents)"
        Host -->|Wake Up!| AgentA[🍔 Fast Food Agent]
        Host -->|Wake Up!| AgentB[🌮 Creative Agent]
        Host -->|Wake Up!| AgentC[🦞 Local Legend Agent]
    end
    
    AgentA -->|Bids| Deal[🔥 The Hot Deals]
    AgentB -->|Bids| Deal
    AgentC -->|Bids| Deal
    
    Deal -->|Winner Selected| Delivery[🚚 Delivery Tracker]
🚀 Killer Features
1. The "Bid-Battle" 🥊
Stop filtering. Start requesting.

The Problem: You spend 20 mins comparing prices.

The Solution: You tell us what you want, and 3 agents throw their best offers at you in 5 seconds.

2. Personality Engines 🤖
Our agents aren't boring bots. They have Attitude.

The National Chains: Focus on speed, bundles, and "up-selling."

The Boston Locals: Focus on authenticity, ingredients, and "neighborhood pride."

3. "Subscription Squad" Mode 📅
Want lunch sorted for the whole month?

Ask for a "30-Day Plan," and the agents stop offering single meals and start offering Bulk Discounts.

Example: The Sweetgreen Agent might offer 20% off if you lock in "Salad Tuesdays" for the month.

4. The "Delight" Chat 💬
Once your food is on the way, the winning agent slides into your DMs with one useful tip.

Taco Bell Agent: "Pro tip: Shake the bag for 5 seconds to mix the sauce perfectly."

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1rWf9tVd0WiCURWoYvXtey_9aHusnrUF7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
