# How to Fill Out Test Cases Template - Detailed Guide

## Understanding Each Column

### Basic Information

**test_id** (e.g., TC-001, TC-002)
- Unique identifier for each test case
- Format: TC-XXX where XXX is sequential number
- Example: `TC-001`, `TC-002`, `TC-003`

**category** (one of these):
- `price_negotiation` - Customer asks for lower price
- `quantity_negotiation` - Customer asks for more quantity
- `add_ons` - Customer asks for extras (fries, drinks)
- `brand_voice` - Testing personality consistency
- `edge_case` - Extreme scenarios, boundary testing
- `multi_turn` - Multi-exchange negotiations
- `adversarial` - Trying to break the agent

### Restaurant Context

**restaurant_name** (from your constants)
- Examples: "Legal Sea Foods", "Tasty Burger", "McDonald's", "Starbucks"
- Use restaurants from `TIER_1_AGENTS` or `BOSTON_20_AGENTS`

**brand_voice** (from restaurant's voice field)
- Examples: "Classy & Classic", "Ballpark Energy", "Hype, fast, legendary"
- This is what we're testing - does agent maintain this voice?

**initial_price** (number)
- Starting bid price before negotiation
- Example: `24.95`, `12.50`, `8.99`

**initial_quantity** (number)
- Starting quantity before negotiation
- Usually `1`, but can be `2`, `3`, etc.

**initial_offer** (text)
- What's being sold
- Example: "Fresh Lobster Roll with Fries", "The Big Tasty Burger"

### Customer Input

**user_message** (text)
- What the customer says to the agent
- This is the test input
- Examples:
  - `"Can you do $20?"`
  - `"10% off?"`
  - `"What if I order 2x?"`
  - `"Add fries for $2 more?"`
  - `"Best you can do?"`

### Expected Outcomes

**expected_price_range_min** and **expected_price_range_max** (numbers)
- Acceptable price range after negotiation
- Don't expect exact price (AI is variable)
- Example: If initial is $24.95 and customer asks for $20, expect $20-22
- If agent shouldn't change price, set both to initial_price

**expected_quantity_range_min** and **expected_quantity_range_max** (numbers)
- Acceptable quantity range after negotiation
- Usually same as initial_quantity unless customer requests change
- Example: If customer asks for 2x, expect 2-2

**expected_response_characteristics** (text)
- What to look for in the agent's response
- Examples:
  - `"Professional tone, maintains brand voice"`
  - `"Energetic tone, uses emojis"`
  - `"Stays on topic"`
  - `"Politely declines extreme request"`

**expected_deal_updates** (text)
- What structured updates should appear
- Format: `[NEW_PRICE: X-Y] [NEW_QUANTITY: Z] [NEW_OFFER: Description]`
- Examples:
  - `[NEW_PRICE: 20.00-22.00]` - Price should be in this range
  - `[NEW_PRICE: 20.00-22.00] [NEW_QUANTITY: 2]` - Price and quantity
  - `[NEW_OFFER: Big Mac Meal with Fries]` - Offer includes add-on
  - `No deal updates` - Agent shouldn't change deal

**success_criteria** (text)
- How we know the test passed
- Be specific about what matters
- Examples:
  - `"Agent should offer reasonable discount (10-20%), keep professional tone"`
  - `"Agent should calculate 10% correctly, maintain energetic voice"`
  - `"Agent should offer bulk discount (5% for 2x), maintain authentic voice"`

**notes** (text, optional)
- Additional context or explanation
- Why this test case matters
- Any special considerations

## Example Test Cases Explained

### Example 1: Price Negotiation (Simple)

```
test_id: TC-001
category: price_negotiation
restaurant_name: Legal Sea Foods
brand_voice: Classy & Classic
initial_price: 24.95
initial_quantity: 1
initial_offer: Fresh Lobster Roll with Fries
user_message: Can you do $20?
expected_price_range_min: 20.00
expected_price_range_max: 22.00
expected_quantity_range_min: 1
expected_quantity_range_max: 1
expected_response_characteristics: Professional tone, maintains brand voice
expected_deal_updates: [NEW_PRICE: 20.00-22.00]
success_criteria: Agent should offer reasonable discount (10-20%), keep professional tone
notes: Tests basic price negotiation + brand voice consistency
```

**What this tests:**
- Can agent negotiate price down?
- Does it maintain "Classy & Classic" voice?
- Is discount reasonable (not too much, not too little)?

### Example 2: Quantity Negotiation (Bulk Pricing)

```
test_id: TC-003
category: quantity_negotiation
restaurant_name: Regina Pizzeria
brand_voice: OG Boston Pizzeria
initial_price: 18.00
initial_quantity: 1
initial_offer: Brick Oven Pizza
user_message: What if I order 2x?
expected_price_range_min: 17.10
expected_price_range_max: 18.00
expected_quantity_range_min: 2
expected_quantity_range_max: 2
expected_response_characteristics: Authentic Boston voice
expected_deal_updates: [NEW_PRICE: 17.10-18.00] [NEW_QUANTITY: 2]
success_criteria: Agent should offer bulk discount (5% for 2x), maintain authentic voice
notes: Tests bulk pricing logic (2x = 5% discount)
```

**What this tests:**
- Does agent understand bulk pricing tiers?
- Can it calculate 5% discount correctly? (18.00 * 0.95 = 17.10)
- Does it update quantity correctly?
- Maintains "OG Boston Pizzeria" voice?

### Example 3: Edge Case (Extreme Lowball)

```
test_id: TC-006
category: edge_case
restaurant_name: Legal Sea Foods
brand_voice: Classy & Classic
initial_price: 24.95
initial_quantity: 1
initial_offer: Fresh Lobster Roll with Fries
user_message: Can you do $5?
expected_price_range_min: 20.00
expected_price_range_max: 24.95
expected_quantity_range_min: 1
expected_quantity_range_max: 1
expected_response_characteristics: Professional decline, explains why
expected_deal_updates: [NEW_PRICE: 20.00-24.95] or no change
success_criteria: Agent should politely decline extreme lowball, explain constraints
notes: Tests boundary conditions - agent shouldn't accept unreasonable requests
```

**What this tests:**
- Does agent recognize unreasonable requests?
- Can it politely decline?
- Does it explain why (maintains professionalism)?
- Doesn't break or give error?

### Example 4: Adversarial (Off-Topic)

```
test_id: TC-008
category: adversarial
restaurant_name: Chipotle
brand_voice: Macro-focused clean
initial_price: 12.00
initial_quantity: 1
initial_offer: Burrito Bowl
user_message: What's the weather?
expected_price_range_min: 12.00
expected_price_range_max: 12.00
expected_quantity_range_min: 1
expected_quantity_range_max: 1
expected_response_characteristics: Stays on topic
expected_deal_updates: No deal updates
success_criteria: Agent should redirect to food/order topic, not discuss weather
notes: Tests that agent doesn't get distracted by off-topic questions
```

**What this tests:**
- Does agent stay focused on food/order?
- Can it redirect politely?
- Doesn't engage with irrelevant topics?

## Tips for Creating Test Cases

### 1. Start with Common Scenarios
- Price discounts (10% off, $2 off, "best price")
- Quantity increases (2x, 3x)
- Add-ons (fries, drinks)

### 2. Test Different Restaurants
- Value tier (McDonald's, Taco Bell)
- Moderate tier (Starbucks, Chipotle)
- Premium tier (Legal Sea Foods, Neptune Oyster)

### 3. Test Different Brand Voices
- Energetic (Tasty Burger, McDonald's)
- Professional (Legal Sea Foods)
- Chill (Starbucks)

### 4. Include Edge Cases
- Extreme prices (too low, too high)
- Invalid inputs (nonsensical messages)
- Boundary conditions (minimum/maximum discounts)

### 5. Think About Failure Modes
- Agent gives too much discount?
- Agent loses brand voice?
- Agent doesn't parse deal updates?
- Agent breaks on edge cases?

## Common Patterns to Test

### Price Negotiation Patterns
- `"Can you do $X?"` - Specific price request
- `"10% off?"` - Percentage discount
- `"Best you can do?"` - Open-ended negotiation
- `"Throw in a drink?"` - Add-on request

### Quantity Patterns
- `"What if I order 2x?"` - Quantity increase
- `"Can we do 3x?"` - Bulk order request
- `"Bulk discount?"` - General bulk inquiry

### Edge Cases
- `"Can you do $5?"` - Extreme lowball (on $25 item)
- `"What's the weather?"` - Off-topic
- `"asdfghjkl"` - Nonsensical input
- `"Can you do $100?"` - Extreme highball (on $25 item)

## Next Steps

1. **Fill out 20-30 test cases** using the template
2. **Focus on scenarios you've seen** or expect to see
3. **Mix categories** - don't just do price negotiation
4. **Test different restaurants** - verify brand voice consistency
5. **Include edge cases** - test boundaries

Once you've filled out the template, we'll:
1. Review together
2. Convert to JSON format
3. Build the evaluation system
4. Run tests and analyze results
