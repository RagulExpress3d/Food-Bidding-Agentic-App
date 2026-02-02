# 🍔 MunchMatch: Reverse-Auction Food Delivery

> Stop searching. Start winning. Let the feast find you.

MunchMatch is an AI-driven food delivery marketplace that flips the traditional model on its head. Instead of browsing menus, you set your preferences and restaurants compete in real-time to win your order through reverse auctions.

**Live Demo:** [Try it here](https://feastbid-boston-872747958244.us-west1.run.app/)

![MunchMatch Preview](https://github.com/user-attachments/assets/94f1667e-a92c-40d2-b52e-a5054ee95790)

## ✨ Features

### 🎯 Reverse Auction Model
- **Set Your Terms**: Define what you want, quantity, and max price
- **Live Bidding**: Watch restaurants compete in real-time with progressive bid streaming
- **Price Discovery**: Save 15-30% vs traditional delivery apps like DoorDash

### 🤖 AI-Powered Agents
- **Brand Agents**: Each restaurant has a unique AI agent with brand personality
- **Smart Bidding**: Agents generate competitive bids based on Boston market pricing
- **AI Negotiation**: Chat directly with restaurant agents to negotiate better deals

### 🎨 Premium UX
- **Apple/DoorDash Style Design**: Clean, modern interface with smooth animations
- **Live Bid Animations**: Bids stream in progressively with real-time updates
- **Food Images**: High-quality food photography for each restaurant
- **Color-Coded Cards**: Visual themes based on food type (pizza=red, Mexican=green, etc.)

### 💬 Interactive Negotiation
- **Quick Prompts**: One-click negotiation suggestions ("Can you do $20?", "Add fries?")
- **Snappy Responses**: High-energy agent interactions with emojis
- **Deal Celebration**: Visual feedback when negotiations succeed

### 📦 Order Management
- **Address Prefill**: Mock address for demos, localStorage persistence
- **Order Tracking**: Real-time logistics feed with status updates
- **Upsell Offers**: Interactive chat-based upsells during delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Food-Bidding-Agentic-App

# Install dependencies
npm install

# Set up environment variables
# Create .env or .env.local file
echo "GEMINI_API_KEY=your_key_here" > .env

# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: Google Gemini API (gemini-2.5-flash for bids, gemini-3-flash for negotiations)
- **Build Tool**: Vite
- **State Management**: React Hooks (useState, useEffect, useMemo)

## 📁 Project Structure

```
Food-Bidding-Agentic-App/
├── components/          # React components
│   ├── BidList.tsx     # Bid display with live streaming
│   ├── NegotiationChat.tsx  # AI negotiation interface
│   ├── Checkout.tsx    # Payment & address
│   ├── Tracking.tsx    # Order tracking
│   └── ...
├── services/           # API services
│   ├── geminiService.ts  # Gemini API integration
│   └── linearService.ts   # Linear API integration
├── utils/              # Utility functions
│   ├── agentThemes.ts  # Restaurant theme mapping
│   ├── bidHelpers.ts   # Bid processing helpers
│   └── brandVoice.ts   # Brand voice utilities
├── docs/               # Documentation
│   ├── planning/       # Implementation plans
│   ├── business/       # Business model docs
│   ├── integration/    # Integration guides
│   └── ...             # Other documentation
├── evaluation/         # Evaluation system (separate)
├── scripts/            # Utility scripts
├── types.ts            # TypeScript definitions
├── constants.ts        # App constants
└── App.tsx             # Main app component
```

## 🎯 Key Components

### BidList
- Progressive bid streaming (1-2 second intervals)
- Live bid counter and animations
- Food images with restaurant logos
- Color-coded cards by food type
- DoorDash comparison badges

### NegotiationChat
- Quick prompt chips for fast negotiation
- AI agent responses with brand personality
- Real-time deal updates
- Celebration animations

### Checkout
- Address prefilling (mock for demos)
- localStorage persistence
- Secure payment terminal UI

## 🔧 Configuration

### Environment Variables

Create a `.env` or `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### API Models

- **Bid Generation**: `gemini-2.5-flash` (fast, cost-effective)
- **Negotiation**: `gemini-3-flash-preview` (snappy responses)

## 📝 Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Test Gemini API key
npm run test:gemini-key
```

## 🎨 Design System

- **Colors**: Custom DD (DoorDash-inspired) color palette
- **Typography**: System fonts with custom tracking
- **Animations**: CSS keyframes with reduced motion support
- **Responsive**: Mobile-first design, max-width container

## 📚 Documentation

- [Code Review](./docs/CODE-REVIEW.md) - Code review findings
- [Comprehensive Code Review](./docs/CODE-REVIEW-COMPREHENSIVE.md) - Full codebase review
- [Business Model](./docs/business/BUSINESS-MODEL-ELITE.md) - Business model analysis
- [Product Requirements](./PRD.md) - Product requirements document
- [Planning Documents](./docs/planning/) - Implementation plans and UX enhancements
- [Integration Guides](./docs/integration/) - Linear and other integrations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Unsplash for food images
- Design inspiration from Apple and DoorDash UX patterns
