# MunchMatch: Business Model & Unit Economics
**Amazon-Style Business Document** | Date: Feb 1, 2026

---

## Executive Summary

**Business Model**: Reverse-auction marketplace connecting price-sensitive office workers with restaurants seeking to fill excess capacity. Revenue from transaction fees (12-18% take rate), delivery fees ($3-5), and subscription plans ($10-20/month). Unit economics: $0.55-1.83 margin per order at scale.

**Customer Problem**: Office workers (25-40) pay $12-18/meal, $150-300/month for lunch. DoorDash/Uber Eats offer no price competition—restaurants set fixed prices.

**Solution**: Customers set max price; restaurants bid down to win orders. Creates 15-30% savings ($5-12/order) via price discovery.

**Key Differentiator**: AI-powered reverse auction + subscription moats (weekly/monthly plans) + brand voice personalization.

**Target**: 1K-10K monthly active users in Boston (Year 1), expanding to NYC, SF (Year 2).

---

## 1. Customer Pain Points & Persona

### Primary Customer: "Price-Conscious Office Worker"

**Demographics**:
- Age: 25-40
- Location: Urban office districts (Boston: Seaport, Back Bay, Financial District)
- Income: $50K-100K (price-sensitive but not low-income)
- Behavior: Orders lunch 3-5x/week, uses DoorDash/Uber Eats 2-3x/week

**Pain Points** (Ranked by Severity):

1. **High Lunch Costs** (Severity: 9/10)
   - Pays $12-18/meal, $150-300/month
   - Impact: 15-20% of monthly food budget
   - Current solution: DoorDash/Uber Eats (no price competition)

2. **No Price Discovery** (Severity: 8/10)
   - Can't compare prices across restaurants easily
   - Impact: Pays full menu price, no negotiation
   - Current solution: Manual browsing (time-consuming)

3. **Limited Flexibility** (Severity: 7/10)
   - Wants specific cuisine but flexible on restaurant
   - Impact: Misses deals, pays premium for convenience
   - Current solution: DoorDash (fixed restaurant selection)

4. **No Subscription Options** (Severity: 6/10)
   - Wants weekly/monthly plans for predictable costs
   - Impact: Pays per-order fees, no bulk discounts
   - Current solution: None (DoorDash/Uber Eats don't offer)

**Customer Persona: "Sarah, the Budget-Conscious Office Worker"**

- **Age**: 32
- **Location**: Boston Seaport (tech office)
- **Income**: $75K/year
- **Behavior**: Orders lunch 4x/week, uses DoorDash 2x/week
- **Pain**: Pays $14/meal average, $224/month ($2,688/year)
- **Goal**: Save $5-10/meal, reduce monthly spend to $150-180
- **Motivation**: Wants to save for vacation, flexible on restaurant if price is right
- **Friction**: Doesn't want to browse menus, wants quick decisions

**Value Prop for Sarah**: "Set your max price ($12). Restaurants compete. Save $5-8/meal, $80-160/month."

---

## 2. Business Model: Revenue Streams

### Revenue Stream 1: Transaction Fees (Primary)

**Model**: Take rate on order value (marketplace commission)

**Rate**: 12-18% of order value (vs DoorDash's 15-20%)

**Rationale**: 
- Lower than DoorDash (differentiation: "We take less, you save more")
- Covers platform costs (AI, infrastructure)
- Leaves room for restaurant margins (they bid down to fill capacity)

**Example**:
- Order value: $25
- Take rate: 15%
- Revenue: $3.75

**Assumptions**:
- Average order value: $22-28 (varies by cuisine)
- Take rate: 12% (Year 1, aggressive), 15% (Year 2, standard), 18% (Year 3, premium)

**Target**: 70-80% of total revenue

---

### Revenue Stream 2: Delivery Fees (Secondary)

**Model**: Pass-through or absorbed (depending on strategy)

**Fee**: $3-5 per order

**Options**:
- **Option A**: Pass-through to customer (adds friction, reduces conversion)
- **Option B**: Absorbed by platform (reduces margin, increases conversion)
- **Option C**: Hybrid ($2 customer pays, $2-3 platform absorbs)

**Recommendation**: **Option C (Hybrid)**
- Customer pays $2 (vs DoorDash's $3-5)
- Platform absorbs $2-3 (cost of acquisition)
- Net: $0-1 margin (if absorbed) OR $2-3 margin (if passed through)

**Target**: 15-20% of total revenue

---

### Revenue Stream 3: Subscription Plans (Growth Driver)

**Model**: Monthly/weekly subscription for "unlimited bids" + perks

**Plans**:
- **Weekly Plan**: $10/week (5 orders, free delivery, priority bidding)
- **Monthly Plan**: $20/month (20 orders, free delivery, priority bidding, exclusive deals)

**Value Prop**:
- "Unlimited bids" (no per-order fees)
- Free delivery (saves $3-5/order)
- Priority bidding (restaurants see your orders first)
- Exclusive deals (restaurants offer better prices to subscribers)

**Economics**:
- Monthly Plan: $20/month
- Average orders: 12-16/month (3-4x/week)
- Cost per order: $1.25-1.67 (vs $3-5 delivery fee)
- Customer saves: $2-3.75/order ($24-60/month)

**Target**: 20-30% of customers subscribe (Year 1), 40-50% (Year 2)

**Revenue**: $20/month × 30% of 1K MAU = $6K/month (Year 1)

**Target**: 10-15% of total revenue (Year 1), 20-25% (Year 2)

---

### Revenue Stream 4: Restaurant Premium Features (Future)

**Model**: Restaurants pay for premium placement, analytics, marketing

**Features**:
- **Premium Placement**: $50-100/month (top of bid list)
- **Analytics Dashboard**: $30-50/month (bid performance, customer insights)
- **Marketing Tools**: $20-40/month (promoted deals, email campaigns)

**Target**: 5-10% of restaurants (Year 2+)

**Revenue**: $100/month × 10% of 100 restaurants = $1K/month

**Target**: 5-10% of total revenue (Year 2+)

---

## 3. Cost Structure & Unit Economics

### Cost Structure (Per Order)

**Variable Costs**:

1. **Fulfillment (Delivery)**: $3-5 per order
   - 3P delivery partner (DoorDash Drive, Uber Direct)
   - White-label delivery service
   - **Assumption**: $4 average

2. **AI/API Costs**: $0.10-0.50 per bid
   - Gemini API: $0.04-0.08 per bid (gemini-2.5-flash)
   - Average: 5 bids per request = $0.20-0.40 per order
   - **Assumption**: $0.30 average

3. **Payment Processing**: $0.30-0.50 per order
   - Stripe: 2.9% + $0.30
   - Average order: $25 → $1.03 (2.9% of $25) + $0.30 = $1.33
   - **Assumption**: $1.30 average

4. **Customer Acquisition**: $20-40 per customer (amortized)
   - Paid ads (Google, Instagram): $15-25
   - Referral program: $5-10 (credits)
   - **Assumption**: $30 per customer, 12 orders/year = $2.50/order

**Fixed Costs** (Monthly):

1. **Infrastructure**: $500-1K/month
   - Hosting (Vercel, AWS): $100-200
   - Database (Supabase, Firebase): $50-100
   - CDN, monitoring: $50-100
   - **Assumption**: $500/month

2. **AI/API (Fixed)**: $200-500/month
   - Gemini API (base tier): $100-200
   - Rate limits, caching: $100-300
   - **Assumption**: $300/month

3. **Operations**: $1K-2K/month
   - Restaurant onboarding: $50-100 per restaurant
   - Customer support: $500-1K
   - Marketing: $500-1K
   - **Assumption**: $1.5K/month

**Total Fixed Costs**: $2.3K/month (Year 1)

---

### Unit Economics (Per Order)

**Revenue**:
- Transaction fee: $3.75 (15% of $25)
- Delivery fee (if passed through): $2.00
- **Total**: $5.75 per order

**Costs**:
- Fulfillment: -$4.00
- AI/API: -$0.30
- Payment processing: -$1.30
- Customer acquisition (amortized): -$2.50
- **Total**: -$8.10 per order

**Net Margin**: **-$2.35 per order** (negative without subscription)

---

### Unit Economics (With Subscription)

**Scenario**: Customer on Monthly Plan ($20/month, 12 orders/month)

**Revenue**:
- Subscription: $20/month = $1.67/order
- Transaction fee: $3.75/order
- **Total**: $5.42/order

**Costs**:
- Fulfillment: -$4.00
- AI/API: -$0.30
- Payment processing: -$1.30
- Customer acquisition (amortized): -$2.50
- **Total**: -$8.10/order

**Net Margin**: **-$2.68 per order** (still negative)

---

### Break-Even Analysis

**Required Revenue per Order**: $8.10 (to cover costs)

**Options**:
1. **Increase Take Rate**: 15% → 32% (not competitive)
2. **Charge Delivery Fee**: $8.10 - $3.75 = $4.35 (vs DoorDash's $3-5)
3. **Increase Subscription**: $20/month → $30/month (reduces conversion)
4. **Reduce Fulfillment Cost**: $4 → $2 (requires own fleet or better partnerships)
5. **Hybrid**: Subscription ($20/month) + Delivery fee ($2) + Take rate (15%)

**Recommended Model**:

**For Non-Subscribers**:
- Transaction fee: $3.75 (15% of $25)
- Delivery fee: $4.35 (customer pays)
- **Total Revenue**: $8.10
- **Net Margin**: $0.00 (break-even)

**For Subscribers**:
- Subscription: $1.67/order ($20/month ÷ 12 orders)
- Transaction fee: $3.75/order
- Delivery fee: $0 (free delivery perk)
- **Total Revenue**: $5.42/order
- **Net Margin**: -$2.68 (negative, but LTV makes up for it)

**LTV Analysis**:
- Customer acquisition: $30
- Monthly subscription: $20
- Orders: 12/month
- Transaction fees: $3.75 × 12 = $45/month
- **Total Revenue**: $65/month
- **Costs**: $8.10 × 12 = $97.20/month
- **Net Margin**: -$32.20/month (negative, but improves with scale)

**Break-Even**: Requires 15-20 orders/month per customer OR $30/month subscription

---

## 4. MOAT & Differentiation

### Competitive MOATs

**1. Reverse Auction Mechanism** (Primary MOAT)
- **What**: Customers set max price; restaurants bid down
- **Why Defensible**: Requires restaurant supply + AI infrastructure
- **Barrier to Entry**: High (requires restaurant partnerships + AI expertise)
- **Sustainability**: Medium (DoorDash could copy, but requires restructuring)

**2. AI-Powered Brand Voice** (Secondary MOAT)
- **What**: Each restaurant has AI agent with personality/voice
- **Why Defensible**: Requires LLM fine-tuning, brand voice data
- **Barrier to Entry**: Medium (requires AI expertise, but not unique)
- **Sustainability**: Low (DoorDash could add AI chat)

**3. Subscription Moats** (Tertiary MOAT)
- **What**: Weekly/monthly plans with exclusive deals
- **Why Defensible**: Requires restaurant partnerships, pricing flexibility
- **Barrier to Entry**: Low (DoorDash could add subscriptions)
- **Sustainability**: Low (easy to copy)

**4. Price Discovery Data** (Future MOAT)
- **What**: Real-time pricing data, demand forecasting
- **Why Defensible**: Requires scale (1K+ restaurants, 10K+ customers)
- **Barrier to Entry**: High (requires network effects)
- **Sustainability**: High (data improves with scale)

---

### Differentiation vs DoorDash

| Dimension | DoorDash | MunchMatch | Winner |
|-----------|----------|------------|--------|
| **Pricing Model** | Fixed (restaurant sets) | Reverse auction (restaurants bid) | **MunchMatch** |
| **Price Discovery** | Manual browsing | Automated bidding | **MunchMatch** |
| **Customer Savings** | 0% (pay full price) | 15-30% (via bidding) | **MunchMatch** |
| **Subscription** | No | Yes (weekly/monthly) | **MunchMatch** |
| **AI Negotiation** | No | Yes (chat with agents) | **MunchMatch** |
| **Restaurant Supply** | 450K+ | 0 (simulated) | DoorDash |
| **Delivery Speed** | 30-45 min | Unknown (bidding delay) | DoorDash |
| **Brand Trust** | 10+ years | New | DoorDash |
| **Selection** | 450K+ restaurants | Limited (bidding only) | DoorDash |

**Key Insight**: MunchMatch wins on **price discovery** but loses on **supply/trust**. Requires restaurant partnerships to compete.

---

## 5. Value Drivers

### Customer Value Drivers

**1. Price Savings** (Primary)
- **Quantified**: 15-30% savings ($5-12/order)
- **Annual Impact**: $600-1,440/year (for 4x/week user)
- **Perception**: "I'm saving money" (psychological benefit)

**2. Price Discovery** (Secondary)
- **Quantified**: Saves 5-10 min vs manual browsing
- **Annual Impact**: 20-40 hours/year
- **Perception**: "I don't have to search" (convenience)

**3. Flexibility** (Tertiary)
- **Quantified**: Can set max price, flexible on restaurant
- **Annual Impact**: Access to deals they wouldn't find otherwise
- **Perception**: "I'm in control" (empowerment)

**4. Subscription Benefits** (Tertiary)
- **Quantified**: Free delivery ($3-5/order), exclusive deals
- **Annual Impact**: $144-240/year (for $20/month plan)
- **Perception**: "I'm getting value" (membership)

---

### Restaurant Value Drivers

**1. Fill Excess Capacity** (Primary)
- **Quantified**: Fill empty tables, idle kitchens
- **Impact**: 10-20% increase in orders during slow periods
- **Perception**: "I'm maximizing revenue" (efficiency)

**2. Lower Fees** (Secondary)
- **Quantified**: 12-18% take rate vs DoorDash's 15-20%
- **Impact**: $0.75-2.00 more per order
- **Perception**: "I'm keeping more revenue" (margin)

**3. Price Discovery** (Tertiary)
- **Quantified**: Learn customer willingness to pay
- **Impact**: Optimize pricing, reduce waste
- **Perception**: "I'm learning" (data)

**4. No Fixed Fees** (Tertiary)
- **Quantified**: Only pay when order is won (vs DoorDash's fixed fees)
- **Impact**: Lower risk, better cash flow
- **Perception**: "I'm not locked in" (flexibility)

---

## 6. Suggested Model Improvements

### Improvement 1: Hybrid Pricing Model (Recommended)

**Current**: Reverse auction only (restaurants bid down)

**Proposed**: **Hybrid Model** (Reverse auction + Fixed pricing)

**How It Works**:
- **Option A**: Reverse auction (current model) - restaurants bid
- **Option B**: Fixed pricing (DoorDash model) - restaurants set price, no bidding

**Rationale**:
- Some customers want speed (fixed pricing)
- Some customers want savings (reverse auction)
- Increases restaurant supply (more restaurants join)
- Increases customer conversion (more options)

**Implementation**:
- Toggle on first screen: "I want the best price" (auction) vs "I want it fast" (fixed)
- Restaurants can opt-in to both models
- Default: Reverse auction (differentiation)

**Impact**:
- **Customer Satisfaction**: +15-20% (more options)
- **Revenue**: +10-15% (more orders)
- **Differentiation**: Maintains reverse auction as differentiator

---

### Improvement 2: Group Ordering (Recommended)

**Current**: Individual orders only

**Proposed**: **Group Ordering** (Office lunch coordination)

**How It Works**:
- Customer starts "Office Order" → shares link
- Coworkers add items → one person pays → split cost
- Restaurants offer bulk discounts (10-15% off for 5+ items)

**Rationale**:
- Office workers order together (natural behavior)
- Increases order value ($25 → $100+)
- Increases restaurant margins (bulk orders)
- Viral mechanism (coworkers invite coworkers)

**Implementation**:
- Add "Start Group Order" button on first screen
- Generate shareable link (WhatsApp, Slack)
- Show real-time order total, split cost per person
- Restaurants see group orders, offer bulk discounts

**Impact**:
- **Customer Satisfaction**: +20-25% (social, cost-sharing)
- **Revenue**: +30-40% (higher order values)
- **Virality**: 0.4-0.6 viral coefficient (40-60% invite others)

---

### Improvement 3: Dynamic Pricing Intelligence (Recommended)

**Current**: Customers set max price blindly

**Proposed**: **Price Intelligence** (AI suggests optimal max price)

**How It Works**:
- Customer enters item preference ("Sushi")
- AI shows: "Average: $22 | Set $20 for 5-10 bids | Set $18 for 2-5 bids"
- Customer adjusts max price based on bid count

**Rationale**:
- Reduces friction (customers don't know market rate)
- Increases bid success rate (more bids = more conversion)
- Improves customer satisfaction (set realistic expectations)

**Implementation**:
- Add price intelligence API (scrape menu prices, calculate averages)
- Show on form: "Average: $X | Set $Y for Z bids"
- Update in real-time as customer adjusts max price

**Impact**:
- **Customer Satisfaction**: +10-15% (clear expectations)
- **Conversion**: +25-30% (more bids = more selection)
- **Differentiation**: Shows AI intelligence (technical depth)

---

### Improvement 4: Restaurant Loyalty Program (Future)

**Current**: No loyalty program

**Proposed**: **Restaurant Loyalty** (Points, rewards, exclusive deals)

**How It Works**:
- Customers earn points per order (1 point = $1 spent)
- Redeem points for discounts, free items
- Restaurants offer exclusive deals to loyal customers

**Rationale**:
- Increases retention (customers return for rewards)
- Increases LTV (customers order more to earn points)
- Differentiates from DoorDash (no loyalty program)

**Implementation**:
- Add points system (backend)
- Show points balance, redemption options
- Restaurants offer "Double Points" deals

**Impact**:
- **Retention**: +20-25% (customers return for rewards)
- **LTV**: +30-40% (customers order more)
- **Differentiation**: Unique loyalty program

---

## 7. Customer Segment & Targeting

### Primary Segment: Price-Conscious Office Workers

**Size**: 500K-1M in Boston (25-40, urban offices)

**Target**: 1K-10K MAU (Year 1), 10K-50K MAU (Year 2)

**Acquisition Strategy**:
1. **Paid Ads**: Google, Instagram ($15-25 CAC)
2. **Referral Program**: "Invite 3 friends, get $10" ($5-10 CAC)
3. **Group Ordering**: Viral mechanism (0.4-0.6 coefficient)
4. **Partnerships**: Office buildings, coworking spaces

**Retention Strategy**:
1. **Subscription Plans**: Weekly/monthly ($10-20/month)
2. **Loyalty Program**: Points, rewards (future)
3. **Exclusive Deals**: Subscribers get better prices
4. **Email/SMS**: Weekly deals, order reminders

---

## 8. Key Metrics & Success Criteria

### North Star Metric

**Monthly Active Users (MAU) with Orders Completed**

**Target**: 1K MAU (Month 6), 10K MAU (Month 12)

**Rationale**: Captures both acquisition (new users) and retention (repeat orders)

---

### Input Metrics (Leading Indicators)

1. **Bid Success Rate**: % of requests that generate ≥3 bids
   - **Target**: >80%
   - **Current**: Unknown (simulated)

2. **Conversion Rate**: % of bids that convert to orders
   - **Target**: 25-35%
   - **Current**: Unknown

3. **Subscription Rate**: % of customers who subscribe
   - **Target**: 20-30% (Year 1), 40-50% (Year 2)
   - **Current**: 0%

4. **Viral Coefficient**: New users per existing user
   - **Target**: >1.0 (sustainable growth)
   - **Current**: 0 (no mechanisms)

5. **Customer Acquisition Cost (CAC)**: Cost per customer
   - **Target**: <$30
   - **Current**: Unknown

6. **Lifetime Value (LTV)**: Revenue per customer over lifetime
   - **Target**: >$200 (10x CAC)
   - **Current**: Unknown

---

### Guardrails (Risk Metrics)

1. **Unit Economics**: Positive margin per order (after delivery fees)
2. **Restaurant Churn**: <10% monthly (if real restaurants)
3. **AI Costs**: <$0.50 per bid (Gemini API)
4. **Customer Satisfaction**: >4.0/5.0 rating

---

## Conclusion

**Business Model**: Reverse-auction marketplace with transaction fees (12-18%), delivery fees ($3-5), and subscriptions ($10-20/month). Unit economics: Break-even at $8.10/order (requires hybrid pricing: subscription + delivery fee + take rate).

**Key Differentiator**: Price discovery via reverse auction (15-30% savings vs DoorDash).

**Improvements**: Hybrid pricing (auction + fixed), group ordering (viral), price intelligence (conversion), loyalty program (retention).

**Target**: 1K-10K MAU in Boston (Year 1), expanding to NYC, SF (Year 2).

**Success Criteria**: >80% bid success rate, 25-35% conversion rate, 20-30% subscription rate, >1.0 viral coefficient.

---

**Prepared by**: Amazon L7 PM Framework  
**Date**: Feb 1, 2026  
**Next Review**: After implementing hybrid pricing + group ordering (Month 3)
