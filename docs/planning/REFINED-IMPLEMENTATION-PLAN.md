# Refined Implementation Plan: Auction Phase

**Based on:** INITIAL-IDEAS.md + resolved ambiguities  
**Target:** Office goers (20–40, office lunch)  
**Scope:** Intent capture + Bidding experience (auction phase only)

**Overall Progress:** 🟩 100% Complete (6/6 phases)

---

## Resolved Decisions

1. ✅ **Default quantity = 1** (user can add more)
2. ✅ **"Suggest 5" is copy/hint only** (e.g. "Perfect for weekly lunch plans — 5 for the week"), not a pre-filled default
3. ✅ **Full-order savings = single order** (unit price × quantity for this bid), not summed over duration
4. ✅ **Target audience = office goers** (20–40, office lunch) — all copy reflects this
5. ✅ **Footer nav simplified** to plain language ("Browse", "Order", "Bids", "Track")
6. ✅ **Sort tie-break:** When savings are equal, prefer lowest "You pay $Y"

---

## Implementation Tasks

### Phase 1: First Screen (Entry & Intent) 🟩 Done

**File:** `components/InspirationCarousel.tsx`

- [x] Add hero line above carousel: **"You set the price. Restaurants compete. You win."**
  - Style: Large, bold, centered, above the category grid
  - Tone: Clear and catchy for office goers
- [x] Keep existing functionality: category selection pre-fills, Custom Order goes to blank form
- [x] Ensure mobile-first, touch-friendly layout

**File:** `components/Header.tsx` (optional)

- [x] Consider simplifying header copy if needed (keep "MunchMatch" branding, ensure "Boston" is clear)

---

### Phase 2: Form Simplification (RequestForm) 🟩 Done

**File:** `components/RequestForm.tsx`

#### Labels to Replace (Remove Jargon)
- [x] "The Objective" → **"What do you want?"**
- [x] "Squad Size" → **"How many?"**
- [x] "Price" → **"Max price per item"** (make "per item" explicit)
- [x] "Drop Frequency" → **"One-time or recurring?"**
- [x] "Initialize MunchMatch" → **"See who wants your order"** or **"Get bids"**

#### Duration Options (Option C)
- [x] Replace buttons: `1 Drop` → **"One-time"**, `7 Days` → **"This week"**, `14 Days` → **"2 weeks"**, `30 Days` → **"This month"**
- [x] Add helper text below duration options: **"Perfect for weekly lunch plans"**
- [x] For "This week" option: Add subtle hint text like **"5 for the week"** (copy only, not a default)
- [x] Keep quantity default at **1** (user can increase)

#### Form Simplification
- [x] Make dietary preferences clearly optional (maybe smaller, secondary styling)
- [x] Ensure form feels like "set your max price & preferences" not a long form
- [x] Mobile-first: touch targets, spacing, clear hierarchy

---

### Phase 3: Bidding Experience (BidList) 🟩 Done

**File:** `components/BidList.tsx`

#### Full-Order Savings Display
- [x] Calculate full-order values:
  - `fullOrderWas = bid.realPrice × quantity`
  - `fullOrderPay = bid.bidPrice × quantity`
  - `fullOrderSave = fullOrderWas - fullOrderPay`
- [x] Display on each bid card: **"Was $X · You pay $Y · Save $Z"**
  - Make savings prominent (larger, colored, bold)
  - Show per-unit prices as secondary/smaller text if needed

#### Sorting
- [x] Add sort controls (toggle or dropdown):
  - **Default:** "Best savings" (sort by `fullOrderSave` descending)
  - **Option:** "Lowest price" (sort by `fullOrderPay` ascending)
- [x] Tie-break logic: When savings are equal, prefer lowest "You pay $Y"

#### Copy Updates (Remove Jargon)
- [x] "THE MATCH ROOM" → **"They're competing for you"** or **"Restaurants are bidding"**
- [x] "AGENTS COMPETING FOR YOUR SELECTION" → **"X restaurants competing for your order"**
- [x] "The Advantage" → **"Why pick them:"**
- [x] "Confirm Match" → **"Take this deal"** or **"Confirm"**
- [x] Keep "Negotiate" as secondary action

#### Loading State
- [x] Replace "THE MATCH ROOM" / "Kitchens are processing your order request..." with:
  - **"Finding the best deals for you…"** or
  - **"Restaurants are bidding on your order"**
- [x] Keep visual spinner/animation, update copy only

#### Visual Hierarchy
- [x] Biggest element = price/savings (Was $X · You pay $Y · Save $Z)
- [x] Then restaurant name and offer
- [x] Then "Why pick them" and other details
- [x] Clear primary action button ("Take this deal")

---

### Phase 4: Footer Navigation 🟩 Done

**File:** `App.tsx` (footer section)

- [x] Simplify nav labels:
  - "Taste" → **"Browse"** or **"Explore"**
  - "Order" → Keep **"Order"** (or "New Order")
  - "Bids" → Keep **"Bids"**
  - "Plate" → **"Track"** or **"Orders"**
- [x] Ensure labels are clear for office goers (no jargon)

---

### Phase 5: Data Flow Updates 🟩 Done

**File:** `App.tsx`

- [x] Pass `quantity` from `constraints` to `BidList` component so it can calculate full-order savings
- [x] Ensure `BidList` receives `quantity` prop: `<BidList quantity={constraints.quantity} ... />`

**File:** `components/BidList.tsx`

- [x] Add `quantity: number` prop
- [x] Use `quantity` to calculate full-order values for each bid
- [x] Implement sorting logic (best savings default, lowest price option, tie-break by lowest pay)

---

### Phase 6: Copy & Tone Pass 🟩 Done

**Files:** All components touched above

- [x] Review all copy for office goer audience (20–40, office lunch)
- [x] Remove any remaining jargon or internal terms
- [x] Ensure tone is: intuitive, catchy, minimal jargon, energetic but clear
- [x] Test that "You set the price. Restaurants compete. You win." value prop is clear throughout

---

## Technical Notes

### No Backend Changes Needed
- `UserConstraints.duration` already supports `'single' | '7' | '14' | '30'` — Option C is label-only
- `Bid` type already has `realPrice` and `bidPrice` — full-order calculation is frontend-only
- `quantity` already exists in `UserConstraints` — just needs to be passed to `BidList`

### Calculation Example
```typescript
// In BidList component
const fullOrderWas = bid.realPrice * quantity;
const fullOrderPay = bid.bidPrice * quantity;
const fullOrderSave = fullOrderWas - fullOrderPay;

// Display: "Was $45.00 · You pay $38.50 · Save $6.50"
```

### Sorting Logic
```typescript
// Default: best savings
bids.sort((a, b) => {
  const saveA = (a.realPrice - a.bidPrice) * quantity;
  const saveB = (b.realPrice - b.bidPrice) * quantity;
  if (saveA !== saveB) return saveB - saveA; // descending
  // Tie-break: lowest "You pay"
  return (a.bidPrice * quantity) - (b.bidPrice * quantity);
});

// Option: lowest price
bids.sort((a, b) => (a.bidPrice * quantity) - (b.bidPrice * quantity));
```

---

## Out of Scope (Stay As-Is)

- Checkout component and flow
- Tracking component and flow
- Negotiation component and flow
- Area picker (MVP Boston-only)
- Backend/data model changes
- Portfolio documentation (separate task)

---

## Success Criteria

- [x] Hero line "You set the price. Restaurants compete. You win." visible on first screen
- [x] Form uses plain language (no "The Objective", "Squad Size", etc.)
- [x] Duration options show "One-time", "This week", "2 weeks", "This month"
- [x] Form CTA says "See who wants your order" or "Get bids"
- [x] Bid cards show full-order "Was $X · You pay $Y · Save $Z"
- [x] Bids sorted by best savings by default (lowest pay wins ties)
- [x] User can sort by lowest price
- [x] Copy uses "They're competing for you", "Why pick them", "Take this deal"
- [x] Loading state says "Finding the best deals..." or "Restaurants are bidding..."
- [x] Footer nav uses plain language ("Browse", "Track", etc.)
- [x] All copy targets office goers (20–40, office lunch)

---

*Ready for implementation. All ambiguities resolved.*
