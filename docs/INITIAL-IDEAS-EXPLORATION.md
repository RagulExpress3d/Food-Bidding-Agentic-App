# INITIAL-IDEAS.md — Logical Check & Exploration

**Role:** Exploration only. No implementation. This document checks INITIAL-IDEAS.md for consistency, maps it to the codebase, and lists ambiguities to resolve before implementation.

---

## 1. Logical consistency of INITIAL-IDEAS.md

### Overall
- **Product, audience, value prop, and flow** are aligned: portfolio app, reverse-auction, “You set the price. Restaurants compete. You win.”, intent → bids → (negotiate) → checkout → tracking. No internal contradictions.
- **Scope** is clearly limited to the auction phase (intent + bidding); checkout, tracking, negotiation stay as-is unless they affect the auction feel.
- **Tone** (§9) explicitly bans jargon and names the terms to replace—consistent with form and bid copy described elsewhere.

### Cross-checks within the doc
| Section | Check | Result |
|--------|--------|--------|
| §4 Entry | “First screen = What do you want?” + hero line above carousel | ✓ Consistent with §3 value prop and §7 flow |
| §5 Form | “Max price (per item)” + duration Option C (One-time, This week, 2 weeks, This month) | ✓ “Per item” matches §6 “unit price × quantity” for full-order savings |
| §5 Duration | “When user picks This week or This month, suggest quantity **5**” | ⚠ **Ambiguity:** For “This month,” 5 feels like a copy-paste from “This week” (5 lunches/week). For a month, 20–22 might be more natural. See Questions below. |
| §6 Savings | “Savings = full order value (unit price × quantity)” | ✓ Clear. Implies “full order” = one order (qty items), not “all deliveries over duration.” |
| §6 Sort | Default best savings; user option lowest price | ✓ No conflict |
| §8 Area | MVP Boston-only, no area picker | ✓ Matches current code (Boston in geminiService, constants) |

### One inconsistency to flag
- **PLAN-AUCTION-PHASE.md** says audience **12–35** and “DoorDash users” in general. **INITIAL-IDEAS.md** says **20–40**, **office lunch**, “5 days a week.” INITIAL-IDEAS is more specific (office lunch, recurring). Decide which audience definition is canonical so copy and “quantity 5 for the week” make sense.

---

## 2. How INITIAL-IDEAS maps to the current codebase

### Entry and intent (§4)
- **App.tsx:** Step flow is `INSPIRATION` → `FORM` → `BIDDING` → …
- **InspirationCarousel:** Has category grid + “Custom Order” (calls `onSelect('')` or `onSelect(cat.pref)`). No hero line on first screen yet.
- **Gap:** Hero line “You set the price. Restaurants compete. You win.” is specified above the carousel but not present in `InspirationCarousel` or `Header`.

### Form (§5)
- **RequestForm:** Uses “The Objective,” “Squad Size,” “Price,” “Drop Frequency,” “Initialize MunchMatch”—all explicitly to be replaced per §9.
- **types.ts:** `UserConstraints.duration` is `'single' | '7' | '14' | '30'`. Option C uses “One-time, This week, 2 weeks, This month”—same semantics, different labels; no data model change needed.
- **Gap:** Form has no “Perfect for weekly lunch plans” line, no suggested quantity 5 for week/month, and no “Max price (per item)” / “See who wants your order” CTA yet.

### Bidding (§6)
- **BidList:** Shows `realPrice` (struck) and `bidPrice` only. No “Save $Z” and no **full-order** (unit × quantity) calculation. No sort (default or “lowest price”).
- **Bid type (types.ts):** Has `realPrice`, `bidPrice`. Full-order savings = (realPrice − bidPrice) × quantity; quantity lives in `UserConstraints` in App state, so BidList can compute it if given `quantity`.
- **Gap:** Copy uses “THE MATCH ROOM,” “AGENTS COMPETING,” “The Advantage,” “Confirm Match”—to be replaced with “They’re competing for you,” “Why pick them,” “Take this deal” / “Confirm,” and loading “Finding the best deals for you…” / “Restaurants are bidding on your order.”

### Services and data
- **geminiService:** Uses `UserConstraints` (itemPref, quantity, budgetCap, duration, dietaryTags); Boston-specific prompt. No change needed for Option C or full-order savings; only UI/labels change.
- **constants.ts:** `INSPIRATION_CATEGORIES` has `pref` strings (e.g. “Street Tacos al Pastor”). Aligns with “vibe pre-fills what do you want.”

### Summary of deltas (implementation will address these)
| Area | INITIAL-IDEAS says | Current code |
|------|--------------------|--------------|
| First screen | Hero line above carousel | No hero line |
| Form labels | “What do you want?”, “How many?”, “Max price”, “One-time or recurring?”, dietary optional | “The Objective,” “Squad Size,” “Price,” “Drop Frequency” |
| Duration | One-time \| This week \| 2 weeks \| This month + “Perfect for weekly lunch plans” + suggest 5 for week/month | 1 Drop, 7/14/30 Days |
| Form CTA | “See who wants your order” / “Get bids” | “Initialize MunchMatch” |
| Bid card | Was $X · You pay $Y · Save $Z (full order); “Why pick them” | Was $X, You pay $Y (per unit); “The Advantage” |
| Bid list | Sort: default best savings, option lowest price | No sort |
| Bid actions | Primary “Take this deal”/“Confirm”, secondary “Negotiate” | “Confirm Match”, “Negotiate” |
| Loading | “Finding the best deals for you…” / “Restaurants are bidding…” | “THE MATCH ROOM” / “Kitchens are processing your order request…” |

---

## 3. Questions and ambiguities

1. **“This month” and quantity 5**  
   Doc says for “This week” or “This month” suggest quantity **5**. For “This month,” do you mean (a) suggest **5** as a default (and user can change to e.g. 20), or (b) actually suggest something like **20** for the month, and “5” was only intended for “This week”?  

2. **“Suggest quantity 5”**  
   Is “suggest” a default (pre-fill 5 when they pick This week / This month) or only a hint in copy (e.g. “5 for the week”) with quantity staying at 1 until the user changes it?  

3. **Full-order “Was $X” / “You pay $Y”**  
   Confirm: “full order” = **this** order (unit price × quantity for the selected bid), not summed over all deliveries in a recurring plan. So for quantity 3, Was = 3×realPrice, You pay = 3×bidPrice, Save = 3×(realPrice−bidPrice). Correct?  

4. **Max price (per item)**  
   Should the form label explicitly say “Max price **per item**” so users don’t think it’s total order cap?  

5. **Audience (20–40 vs 12–35)**  
   INITIAL-IDEAS says 20–40 and office lunch; PLAN-AUCTION-PHASE says 12–35. Which is the source of truth for copy and for “weekly lunch plans” / quantity 5?  

6. **Footer nav labels**  
   Current footer: “Taste,” “Order,” “Bids,” “Plate.” Doc doesn’t mention them. Should these stay, or be switched to plain language (e.g. “Track” instead of “Plate”) as part of §9 tone?  

7. **Sort tie-break**  
   When sorting by “best savings,” if two bids have the same Save $Z, prefer lowest “You pay $Y,” or leave order undefined?  

---

## 4. Scope summary (when ambiguities are resolved)

**In scope (from INITIAL-IDEAS):**
- First screen: hero line above carousel; intent = vibe (tap category → pre-fill) or Custom (blank).
- Form: plain labels, Option C duration labels, “Perfect for weekly lunch plans,” quantity suggestion for week/month, CTA “See who wants your order” / “Get bids.”
- Bid list: full-order “Was $X · You pay $Y · Save $Z” on each card; default sort best savings; user option sort by lowest price; copy “They’re competing for you,” “Why pick them,” “Take this deal”/“Confirm,” “Negotiate”; loading copy “Finding the best deals…” / “Restaurants are bidding…”
- Tone: remove internal jargon everywhere (form, bid list, loading).
- Portfolio: document what the app is, who it’s for, why the auction is the differentiator; optional talking points.

**Out of scope for this phase:**
- Checkout, tracking, negotiation logic and flow (stay as-is unless they affect auction feel).
- Area picker (MVP Boston-only).
- Backend/data model changes for duration (Option C is label/copy only).

---

## 5. Conclusion

INITIAL-IDEAS.md is **logically consistent** and fits the existing flow and data model. The main open points are: (1) “This month” + quantity 5 vs 20, (2) whether “suggest 5” is a default or copy-only, (3) confirmation that full-order savings = single order (qty × unit), (4) audience 20–40 vs 12–35, and (5) whether footer nav labels are in scope. Once those are decided, the plan is ready for implementation with no further assumptions.

---

*Exploration only. No code changes. Implementation is a separate step.*

---

## Update: Ambiguities Resolved

All questions have been answered. See **REFINED-IMPLEMENTATION-PLAN.md** for the actionable implementation plan with all decisions incorporated.
