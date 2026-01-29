<img width="561" height="752" alt="image" src="https://github.com/user-attachments/assets/94f1667e-a92c-40d2-b52e-a5054ee95790" />


Try out here in live link : https://feastbid-boston-872747958244.us-west1.run.app/

🍔 MunchMatch: The Reverse-Auction Food Delivery Protocol
Stop searching. Start winning. Let the feast find you.
MunchMatch is a high-octane, AI-driven food delivery marketplace localized for the Boston Arena. Built on the FeastBid Operating System, it flips the traditional delivery model on its head. Instead of you browsing endless menus, you state your Objective, and a fleet of Autonomous Brand Agents bid against each other in real-time to win your order.
🚀 The Core Flow
The Objective: Set your target (e.g., "Street Tacos"), define your squad size, and lock in your price cap.
The Match Room: Watch as Tier-1 National Giants (McDonald's, Chipotle) and Tier-2 Local Legends (Legal Sea Foods, Regina Pizzeria) generate competitive, mathematically viable bids.
The Negotiation: Don't like the price? Jump into a direct chat with the restaurant’s AI Agent. Haggle for a better unit price, bundle in a 30-day subscription, or secure "secret menu" perks.
The Plate: Confirm the deal through a secure mock-terminal and track your order via a high-fidelity logistics feed.
🧠 The Agent Intelligence (FeastBid OS)
MunchMatch isn't just a UI; it's a simulation of restaurant economics. Each brand is represented by a unique Agent Logic Instance featuring:
Real-Time Bidding: Agents simulate web-scrapes of current Boston menu prices (including market-rate seafood) to ensure bids are competitive yet viable.
Brand Voice: Every interaction is flavored with the brand's personality—from Wendy’s legendary sass to the "OG" energy of the North End's Regina Pizzeria.
Subscription Moats: For long-term hunger, agents offer "Commuter Passes" and "Office Lunch Plans" that traditional apps can't match.
The Delight Engine: Post-checkout engagement where agents provide "Expert Tips" (e.g., "Reheat your pizza in a skillet, not the microwave!") to maximize Lifetime Value (LTV).
🛠 Technical Architecture
Framework: React 19 + TypeScript.
Styling: Tailwind CSS with a custom "Battle-Ready" UI/UX (High-contrast, mobile-first, and haptic-inspired).
Intelligence: Powered by Google Gemini API (using gemini-3-flash-preview for bidding and gemini-3-pro-preview for complex negotiations).
State Management: Lightweight, reactive state handling for real-time bidding simulations and logistics tracking.
Localization: Deep-linked Boston data—from Seaport seafood prices to Back Bay delivery ETAs.

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
