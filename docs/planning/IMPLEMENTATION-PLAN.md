# Feature Implementation Plan

**Overall Progress:** `0%`

## TLDR

Implement the initial product vision from INITIAL-IDEAS.md: align the existing reverse-auction food app with the agreed copy, UX, and data model. Focus on (1) first-screen hero line and intent entry, (2) form labels and duration framing for office lunch, (3) bid list with full-order “Was $X · You pay $Y · Save $Z,” default sort by best savings and optional sort by lowest price, and (4) consistent B2C tone with no internal jargon. No new flow steps; fit changes into the current INSPIRATION → FORM → BIDDING → (Negotiate) → CHECKOUT → TRACKING flow.

## Critical Decisions

- **Entry & hero:** First screen = “What do you want?” with hero line “You set the price. Restaurants compete. You win.” above the carousel — so value prop is clear in ~2 seconds.
- **Intent:** Keep vibe + free text: tap category → pre-fill “what do you want?” on form; add “Custom order” entry that goes to form with blank field. No new backend field.
- **Duration (Option C):** Labels only: **One-time** | **This week** | **2 weeks** | **This month**. Add one line “Perfect for weekly lunch plans.” When user picks This week or This month, suggest quantity **5** (e.g. “5 for the week”). Same data model (`single` / `7` / `14` / `30`).
- **Savings:** Full-order only: “Was $X · You pay $Y · Save $Z” where X = full order at real price, Y = full order at bid price, Z = X − Y. Unit price × quantity for the order.
- **Sort:** Default = best savings (most savings first). User option = sort by lowest price (lowest bid first).
- **Area:** MVP Boston-only; no area picker. Area swappable in vision for later.
- **Tone:** B2C, benefit-led, no internal terms (e.g. replace “The Objective,” “Squad Size,” “Drop Frequency,” “Match Room,” etc. with “What do you want?,” “How many?,” “One-time or recurring?”). Footer nav labels can stay or be aligned to same tone.

## Tasks

- [ ] 🟥 **Step 1: First screen — hero line and “What do you want?”**
  - [ ] 🟥 Add hero line above carousel: “You set the price. Restaurants compete. You win.”
  - [ ] 🟥 Frame the screen as “What do you want?” (heading or subheading).
  - [ ] 🟥 Ensure carousel categories still pre-fill intent on the next screen (no change to data flow).

- [ ] 🟥 **Step 2: Intent entry — “Custom order” path**
  - [ ] 🟥 Add a “Custom order” entry (e.g. tile or button) that navigates to FORM with blank `itemPref`.
  - [ ] 🟥 Form “What do you want?” field: show pre-filled text when coming from vibe; show placeholder when coming from Custom (user types from scratch).

- [ ] 🟥 **Step 3: Request form — labels, duration, and CTA**
  - [ ] 🟥 Replace jargon with benefit-led copy: “The Objective” → “What do you want?”, “Squad Size” → “How many?”, “Price” → “Max price (per item)”, “Drop Frequency” → “One-time or recurring?” (or duration labels below).
  - [ ] 🟥 Duration labels: One-time | This week | 2 weeks | This month (map to existing `single` | `7` | `14` | `30`).
  - [ ] 🟥 Add one line: “Perfect for weekly lunch plans.”
  - [ ] 🟥 When duration is This week or This month, suggest quantity 5 (e.g. hint “5 for the week” or pre-fill 5 with clear affordance to change).
  - [ ] 🟥 Form heading/framing: “Set your max price and preferences.”
  - [ ] 🟥 Primary CTA: “See who wants your order” or “Get bids” (replacing current submit label if different).
  - [ ] 🟥 Optional: label dietary section as “Dietary preferences (optional).”

- [ ] 🟥 **Step 4: Bid list — framing, full-order savings, and sort**
  - [ ] 🟥 Framing: “They’re competing for you.” (heading or subheading).
  - [ ] 🟥 Each bid card: show full-order “Was $X · You pay $Y · Save $Z” (X = realPrice × quantity, Y = bidPrice × quantity, Z = X − Y). Biggest visual element = price/savings; then restaurant and offer.
  - [ ] 🟥 Default sort: best savings (most savings first).
  - [ ] 🟥 User option: sort by lowest price (lowest bid first).
  - [ ] 🟥 Copy: restaurant name, one-line offer, “Why pick them:” (one line, e.g. from existing moat/reason), then price/savings. Primary action “Take this deal” or “Confirm”; secondary “Negotiate.”
  - [ ] 🟥 Loading state: “Finding the best deals for you…” or “Restaurants are bidding on your order.”

- [ ] 🟥 **Step 5: Tone and nav**
  - [ ] 🟥 Remove or replace any remaining internal jargon across Header, footer nav, Checkout, Tracking, NegotiationChat (e.g. “Taste,” “Order,” “Bids,” “Plate” — keep only if aligned with simple B2C tone).
  - [ ] 🟥 Ensure mobile-first, touch-friendly hierarchy: biggest = price/savings where relevant.

- [ ] 🟥 **Step 6: Types and wiring**
  - [ ] 🟥 Ensure `UserConstraints` and `Bid` support full-order calculations (quantity available where bids are rendered; realPrice and bidPrice per unit). No new types required if quantity is in context.
  - [ ] 🟥 Pass `quantity` (from constraints) into BidList so each card can compute Was/You pay/Save for full order.
  - [ ] 🟥 Boston-only: no area picker in MVP; location/area can remain implicit or fixed for now.

---

*Plan derived from INITIAL-IDEAS.md. Implementation is separate; update status emojis as work completes.*
