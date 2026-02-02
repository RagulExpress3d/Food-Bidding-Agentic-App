# Initial Ideas We Have Developed

Planning and product ideas only. No implementation in this document.

---

## 1. What We’re Building

- **Product:** A DoorDash-style app as a **portfolio product**—not a full commercial launch. It showcases your product and technical abilities.
- **Differentiator:** **Agentic, reverse-auction** food ordering: the user states **intent** (what they want), then restaurants **bid** for their order. The auction phase is the hero.
- **Core flow:** Intent → Bids → (optional Negotiate) → Checkout → Tracking. We focus on making **intent capture** and **bidding** intuitive and catchy.

---

## 2. Who It’s For

- **Primary:** **Working professionals, 20–40**, in the US. People who already use DoorDash.
- **Use case:** **Office lunch**—people who need food **5 days a week** for lunch. The app is tailored to them (recurring, weekly/monthly plans) rather than one-off orders.
- **Experience:** B2C, **very simple** to understand. They should feel: “I set my max price, restaurants compete, I get better deals than fixed menu prices.”

---

## 3. Value Proposition

- **One line:** “You set the price. Restaurants compete. You win.”
- **In the UI:** Emphasize **discount vs fixed price**: “Was $X” vs “You pay $Y” and “Save $Z” so the benefit is obvious at a glance. User is in control; restaurants compete for them.

---

## 4. Entry and Intent (First Screen)

- **Start here:** The app always starts from a **“What do you want?”** screen. Super simple, intuitive.
- **Hero line:** On the **first screen** (above the carousel): “You set the price. Restaurants compete. You win.” so DoorDash users get the idea in 2 seconds.
- **Intent = vibe + free text combined:**  
  - **Pick a vibe:** Tap a category (e.g. Tacos, Sushi) → that pre-fills “what do you want?” on the next screen; user can edit.  
  - **Custom:** Tap “Custom order” → next screen has a blank field; user types from scratch.  
  - Targets Gen Z–friendly, flexible input (one tap or one sentence to intent).

---

## 5. Set Max Price & Preferences (Form)

- **Framing:** “Set your max price and preferences” — not a long form. Labels are plain and benefit-led.
- **Fields (concept):**  
  - What do you want? (pre-filled from vibe or blank)  
  - How many?  
  - Max price (per item)  
  - One-time or recurring?  
  - Dietary preferences (optional)
- **Duration (Option C — office lunch):**  
  - Labels: **One-time** | **This week** | **2 weeks** | **This month**.  
  - One line of copy: “Perfect for weekly lunch plans.”  
  - When user picks **This week** or **This month**, suggest quantity **5** (e.g. “5 for the week”) so it feels like “lunch for the week” without adding a “days per week” field.  
  - No new backend field; same data model, friendlier framing.
- **CTA:** One clear action: **“See who wants your order”** (or “Get bids”) → leads into the auction.

---

## 6. Bidding Experience (Bid List)

- **Framing:** “They’re competing for you.” Restaurants bid; user sees deals.
- **Discount on full order:**  
  - Show **“Was $X”** and **“You pay $Y”** and **“Save $Z”** on every bid card.  
  - **Savings = full order value** (unit price × quantity), not per unit.
- **Sorting:**  
  - **Default:** Best savings (most savings first).  
  - **User option:** Sort by **lowest price** (lowest bid first).
- **Copy:** Short and scannable: restaurant name, one-line offer, “Why pick them:” (one line), price/savings. **Primary action:** “Take this deal” (or “Confirm”). **Secondary:** “Negotiate.”
- **Loading:** “Finding the best deals for you…” / “Restaurants are bidding on your order” so the auction idea is reinforced.

---

## 7. Flow and Scope

- **Auction phase in scope:** (1) Intent capture (first screen + form), (2) Bidding (bid list with full-order savings and sort). Checkout, tracking, negotiation stay as-is unless they affect how the auction feels.
- **Flow length:** 2–3 main screens for the core path: intent → bids → (negotiate optional) → checkout. No extra steps.
- **Visual hierarchy:** Biggest element = price/savings; then restaurant and offer. Mobile-first, touch-friendly.

---

## 8. Area and Localization

- **Vision:** Area is **swappable**—user could pick any area later.
- **MVP:** **Boston-specific**. No area picker in MVP; we can add it later.

---

## 9. Tone and Copy

- **Audience:** 20–40, working professionals; simple for current DoorDash users.
- **Tone:** Intuitive, catchy, minimal jargon. No internal terms like “The Objective,” “Match Room,” “Initialize MunchMatch,” “Squad Size,” “Drop Frequency.” Use plain, benefit-led language (“What do you want?”, “Max price”, “How many?”, “One-time or recurring?”).
- **Energetic but clear.**

---

## 10. Portfolio Angle

- **What to document (for portfolio):**  
  - What the app is: DoorDash-style, reverse-auction, agentic.  
  - Who it’s for: 20–40 US, office lunch.  
  - Why the auction phase is the differentiator: discounts vs fixed price, user in control.
- **Optional:** 2–3 “portfolio talking points” (e.g. intent-based UX, AI-driven bids, negotiation) for demos and interviews.

---

## Summary Table

| Idea | Decision |
|------|----------|
| Product | DoorDash competitor, portfolio only; auction phase = hero |
| Audience | 20–40, working professionals, US; office lunch (5 days/week) |
| Entry | Start from “What do you want?” screen; hero line on first screen |
| Intent | Vibe + free text combined (pick a vibe → pre-fill, or Custom → type) |
| Duration | Option C: One-time, This week, 2 weeks, This month + “Perfect for weekly lunch plans” + quantity 5 hint for week/month |
| Savings | Full-order “Was $X · You pay $Y · Save $Z” |
| Sort | Default best savings; user can choose lowest price |
| Area | Swappable in vision; MVP Boston-only |
| Tone | B2C, simple, no internal jargon |

---

*This document reflects the initial ideas developed during exploration. Implementation is separate.*
