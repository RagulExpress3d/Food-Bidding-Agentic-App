# Quantity-First Negotiation Implementation Plan

**Overall Progress:** `86%` (6 of 7 steps completed)

## TLDR
Transform the negotiation chat to prioritize quantity increases as the primary negotiation lever. Both customers and restaurants benefit: customers get better unit prices for bulk orders, restaurants increase volume. Quick prompts, AI agent behavior, and initial messaging will all emphasize quantity-based deals over simple price discounts.

## Critical Decisions
- **Quantity-first prompts**: Quick prompts will suggest quantity increases ("What if I order 2x?", "Can we do 3x?") instead of price reductions
- **AI agent motivation**: Restaurant agents will actively encourage quantity increases and offer better unit prices for bulk orders (e.g., "Order 2x and I'll drop it to $X per unit")
- **Initial message strategy**: Opening message will hint at quantity-based deals ("Order more and I'll give you a better unit price!")
- **Visual quantity emphasis**: UI will highlight quantity changes prominently, showing savings from bulk orders
- **Bulk pricing logic**: Unit price decreases as quantity increases (e.g., 1x = $25, 2x = $23 each, 3x = $21 each)

## Tasks

- [x] 🟩 **Step 1: Update Quick Prompts to Quantity-First**
  - [x] 🟩 Replace price-focused prompts with quantity suggestions (e.g., "What if I order 2x?", "Can we do 3x?", "What's your best bulk deal?")
  - [x] 🟩 Add prompts that combine quantity with price (e.g., "2x for $X total?", "3x and you drop the price?")
  - [x] 🟩 Make prompts dynamic based on current quantity (suggest next quantity tier)

- [x] 🟩 **Step 2: Enhance AI Agent System Instructions**
  - [x] 🟩 Update system instructions to prioritize quantity increases over price reductions
  - [x] 🟩 Add bulk pricing tiers (e.g., 2x = 5% discount, 3x = 10% discount, 4x+ = 15% discount)
  - [x] 🟩 Instruct agent to proactively suggest quantity increases ("Want a better deal? Order 2x and I'll drop it to $X!")
  - [x] 🟩 Emphasize restaurant's motivation: "We love bulk orders - more volume = better prices for you!"

- [x] 🟩 **Step 3: Update Initial Agent Message**
  - [x] 🟩 Modify opening message to hint at quantity-based deals
  - [x] 🟩 Add messaging like "Order more and I'll give you a better unit price!" or "Bulk orders get better deals!"
  - [x] 🟩 Make it clear that quantity is the primary negotiation lever

- [x] 🟩 **Step 4: Enhance Quantity Display & Visual Feedback**
  - [x] 🟩 Show quantity prominently in the deal summary
  - [x] 🟩 Display unit price savings when quantity increases (e.g., "Was $25 each, now $23 each for 2x")
  - [x] 🟩 Add visual indicators for bulk savings (e.g., "Save $4 total with 2x!")
  - [x] 🟩 Highlight quantity changes in the "Revised Battle Terms" section

- [x] 🟩 **Step 5: Add Quantity Input Controls**
  - [x] 🟩 Add +/- buttons or quantity selector in the negotiation UI
  - [x] 🟩 Allow users to quickly adjust quantity during negotiation
  - [x] 🟩 Show real-time price updates as quantity changes
  - [x] 🟩 Display bulk pricing tiers visually (e.g., "2x = $X each, 3x = $Y each")

- [x] 🟩 **Step 6: Update Celebration Logic**
  - [x] 🟩 Celebrate quantity increases, not just price decreases
  - [x] 🟩 Show celebration when user increases quantity or agent offers bulk discount
  - [x] 🟩 Update celebration message to reflect quantity-based deals

- [ ] 🟨 **Step 7: Test & Refine Negotiation Flow**
  - [x] 🟩 Code implementation complete - ready for testing
  - [ ] 🟥 Test that AI agents actively suggest quantity increases
  - [ ] 🟥 Verify bulk pricing logic works correctly
  - [ ] 🟥 Ensure quick prompts guide users toward quantity negotiations
  - [ ] 🟥 Test edge cases (max quantity, minimum orders, etc.)
