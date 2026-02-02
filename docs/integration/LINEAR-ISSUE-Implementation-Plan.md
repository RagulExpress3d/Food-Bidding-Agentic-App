# Linear issue — copy title and description below into Linear

---

## Title (paste into Linear issue title)

**Implement product vision from IMPLEMENTATION-PLAN: hero, form copy, bid list savings/sort, B2C tone**

---

## Description (paste into Linear issue description)

Implement the initial product vision from `INITIAL-IDEAS.md` and `IMPLEMENTATION-PLAN.md`: align the existing reverse-auction food app with agreed copy, UX, and data model. No new flow steps; fit changes into current **INSPIRATION → FORM → BIDDING → (Negotiate) → CHECKOUT → TRACKING** flow.

### Scope

1. **First screen** — Hero line and “What do you want?” framing  
2. **Intent entry** — “Custom order” path (blank form)  
3. **Request form** — Benefit-led labels, duration (One-time / This week / 2 weeks / This month), “Perfect for weekly lunch plans,” quantity 5 hint, CTA “See who wants your order” / “Get bids”  
4. **Bid list** — “They’re competing for you,” full-order “Was $X · You pay $Y · Save $Z,” default sort by best savings + option by lowest price, loading copy  
5. **Tone** — Remove internal jargon (e.g. “The Objective,” “Squad Size,” “Drop Frequency”); mobile-first hierarchy  
6. **Types/wiring** — Pass `quantity` into BidList for full-order savings; Boston-only MVP  

### Critical decisions (from plan)

- **Hero:** “You set the price. Restaurants compete. You win.” above carousel.  
- **Duration labels:** One-time | This week | 2 weeks | This month (map to `single` | `7` | `14` | `30`).  
- **Savings:** Full-order only: Was $X · You pay $Y · Save $Z (X = realPrice×qty, Y = bidPrice×qty, Z = X−Y).  
- **Sort:** Default = best savings; user option = lowest price.  
- **Tone:** B2C, benefit-led; no internal terms.  

### Tasks (from IMPLEMENTATION-PLAN.md)

**Step 1: First screen**
- Add hero line above carousel: “You set the price. Restaurants compete. You win.”
- Frame screen as “What do you want?” (heading or subheading).
- Ensure carousel categories still pre-fill intent on next screen.

**Step 2: Intent entry**
- Add “Custom order” entry (tile or button) → FORM with blank `itemPref`.
- Form “What do you want?”: pre-filled when from vibe; placeholder when from Custom.

**Step 3: Request form**
- Replace jargon: “The Objective” → “What do you want?”, “Squad Size” → “How many?”, “Price” → “Max price (per item)”, “Drop Frequency” → duration labels.
- Duration labels: One-time | This week | 2 weeks | This month.
- Add “Perfect for weekly lunch plans.” When This week or This month, suggest quantity 5.
- Form framing: “Set your max price and preferences.” CTA: “See who wants your order” or “Get bids.”
- Dietary: “Dietary preferences (optional).”

**Step 4: Bid list**
- Framing: “They’re competing for you.”
- Each card: full-order “Was $X · You pay $Y · Save $Z”; biggest element = price/savings.
- Default sort: best savings; user option: lowest price.
- Copy: restaurant name, offer, “Why pick them:”, price/savings. Primary “Take this deal”/“Confirm”; secondary “Negotiate.”
- Loading: “Finding the best deals for you…” or “Restaurants are bidding on your order.”

**Step 5: Tone and nav**
- Remove/replace remaining jargon in Header, footer nav, Checkout, Tracking, NegotiationChat.
- Mobile-first: biggest = price/savings where relevant.

**Step 6: Types and wiring**
- Pass `quantity` (from constraints) into BidList for full-order Was/You pay/Save.
- Boston-only; no area picker.

### Acceptance

- All copy and labels match IMPLEMENTATION-PLAN and INITIAL-IDEAS.
- Full-order savings on every bid card; sort by savings (default) and by lowest price.
- Custom order path and hero line live; no new flow steps.

---

*Source: `IMPLEMENTATION-PLAN.md`. Assign to @Cursor to have the agent implement.*
