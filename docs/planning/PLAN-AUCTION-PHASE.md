# Feature Implementation Plan: Auction Phase (Intent → Bids)

**Overall Progress:** `0%`

---

## TLDR

Build the **auction phase** of this DoorDash-style portfolio app so it feels like the hero: the user states what they want (intent), then sees restaurants bid for their order. The experience should be **intuitive and catchy** for US consumers aged 12–35 who already use DoorDash, and make the value obvious—**discounts and control** instead of fixed menu prices. No new scope beyond clarifying the app, focusing on the auction phase, and defining UX/copy for that segment.

---

## Critical Decisions

- **Positioning:** DoorDash competitor as a **portfolio product**—showcases agentic e‑commerce and reverse-auction mechanics, not a full commercial launch. The auction phase is the differentiator to highlight.
- **Scope for this plan:** Focus on the **auction phase only**—(1) intent capture (Inspiration + RequestForm) and (2) bidding / Match Room (BidList). Checkout, tracking, and negotiation stay as-is unless they directly affect how the auction feels.
- **Audience:** 12–35 years old in the US, current DoorDash users. UX and copy should feel familiar (quick, mobile-first, visual) but clearly communicate “you set the cap, they compete—you get better deals.”
- **Value narrative:** Emphasize **discount vs fixed price** in the UI: show “was $X” vs “your price $Y,” “you’re in control,” and “restaurants compete for you” so the shift from fixed-price ordering is obvious at a glance.
- **Tone:** Intuitive and catchy—minimal jargon (e.g. “Objective,” “Match Room,” “Initialize MunchMatch” can be softened or reframed for a 12–35 audience). Keep it energetic but clear.

---

## Tasks

- [ ] 🟥 **Step 1: Align intent capture with “what do you want?” (Inspiration + RequestForm)**
  - [ ] 🟥 Reframe Inspiration carousel so it’s the main entry: “What are you craving?” / “Pick a vibe or type your own” — one tap or one sentence to intent.
  - [ ] 🟥 Simplify RequestForm labels and flow so it feels like “set your max price & preferences” (budget cap, dietary, size) rather than a long form. Consider optional fields or progressive disclosure.
  - [ ] 🟥 Ensure one clear CTA from intent → “Get bids” / “See who wants your order” that leads into the auction.

- [ ] 🟥 **Step 2: Make the bidding experience (Match Room / BidList) feel like “they’re competing for you”**
  - [ ] 🟥 Surface discount prominently: real price vs bid price (e.g. “Was $X · You pay $Y” or “Save $Z”) on every bid card so the value is instant.
  - [ ] 🟥 Order or highlight bids by “best deal” or “most savings” so users see the benefit of the auction model immediately.
  - [ ] 🟥 Use short, scannable copy: restaurant name, one-line offer, price, and one clear primary action (e.g. “Take this deal” / “Confirm”) with negotiate as secondary.

- [ ] 🟥 **Step 3: Copy and microcopy for 12–35 DoorDash users**
  - [ ] 🟥 Replace or soften internal terms (“The Objective,” “Initialize MunchMatch,” “Squad Size,” “Drop Frequency”) with plain, benefit-led language (“What do you want?”, “Max price”, “How many?”, “One-time or recurring?”).
  - [ ] 🟥 Add one hero line above or below the auction (e.g. “You set the price. Restaurants compete. You win.”) so the value prop is explicit.
  - [ ] 🟥 Ensure loading state for bids says something like “Finding the best deals for you…” to reinforce the auction idea.

- [ ] 🟥 **Step 4: Visual and UX polish for the auction phase (12–35, mobile-first)**
  - [ ] 🟥 Keep the auction flow to 2–3 main screens: intent → bids → (negotiate optional) → checkout. No extra steps in the core path.
  - [ ] 🟥 Use clear visual hierarchy: biggest element = price/savings, then restaurant and offer. Touch targets and spacing suitable for thumbs and small screens.
  - [ ] 🟥 Consider a single, consistent “discount” or “savings” treatment (color/badge) across BidList so the benefit is recognizable at a glance.

- [ ] 🟥 **Step 5: Document “application we’re building” for portfolio**
  - [ ] 🟥 Add a short product one-pager or README section: what the app is (DoorDash-style, reverse-auction, agentic), who it’s for (12–35 US), and why the auction phase is the differentiator (discounts vs fixed price, user in control).
  - [ ] 🟥 Optionally: 2–3 bullet “portfolio talking points” (e.g. intent-based UX, AI-driven bids, negotiation) for demos and interviews.

---

*Plan scope: auction phase (intent → bids) only. No implementation in this document.*
