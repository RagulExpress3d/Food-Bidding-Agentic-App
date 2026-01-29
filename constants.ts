
import { Agent } from './types';

export const INSPIRATION_CATEGORIES = [
  { id: 'pizza', title: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', pref: 'Extra Cheesy Pepperoni Pizza' },
  { id: 'burger', title: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80', pref: 'Juicy Smash Burger' },
  { id: 'sushi', title: 'Sushi', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80', pref: 'Fresh Sushi Platter' },
  { id: 'tacos', title: 'Tacos', img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80', pref: 'Street Tacos al Pastor' },
  { id: 'pasta', title: 'Pasta', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', pref: 'Creamy Fettuccine Alfredo' },
  { id: 'lobster', title: 'Lobster', img: 'https://images.unsplash.com/photo-1559740038-09559f972041?auto=format&fit=crop&w=400&q=80', pref: 'Warm Butter Lobster Roll' },
  { id: 'ramen', title: 'Ramen', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80', pref: 'Spicy Tonkotsu Ramen' },
  { id: 'wings', title: 'Wings', img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=400&q=80', pref: 'Buffalo Chicken Wings' },
  { id: 'salad', title: 'Salads', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', pref: 'Crunchy Caesar Salad' },
  { id: 'poke', title: 'Poke', img: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=400&q=80', pref: 'Fresh Ahi Tuna Poke Bowl' },
  { id: 'burrito', title: 'Burritos', img: 'https://images.unsplash.com/photo-1584031036380-3fb6f2d51880?auto=format&fit=crop&w=400&q=80', pref: 'Giant Mission Burrito' },
  { id: 'steak', title: 'Steak', img: 'https://images.unsplash.com/photo-1546241072-48010ad28c2c?auto=format&fit=crop&w=400&q=80', pref: 'Ribeye Steak & Fries' },
  { id: 'coffee', title: 'Coffee', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', pref: 'Iced Oat Milk Latte' },
  { id: 'donuts', title: 'Donuts', img: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=400&q=80', pref: 'Glazed Donuts Dozen' },
  { id: 'icecream', title: 'Ice Cream', img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=400&q=80', pref: 'Three Scoop Sundae' },
  { id: 'thai', title: 'Thai', img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80', pref: 'Pad Thai Shrimp' },
  { id: 'dimsum', title: 'Dim Sum', img: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=400&q=80', pref: 'Steamed Dumplings' },
  { id: 'bbq', title: 'BBQ', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80', pref: 'Smoked Beef Brisket' },
  { id: 'sandwich', title: 'Subs', img: 'https://images.unsplash.com/photo-1539252554452-da09241684c2?auto=format&fit=crop&w=400&q=80', pref: 'Italian Sub Sandwich' },
  { id: 'smoothie', title: 'Smoothies', img: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=400&q=80', pref: 'Tropical Fruit Smoothie' },
  { id: 'bagels', title: 'Bagels', img: 'https://images.unsplash.com/photo-1585476108011-1550a6a8c348?auto=format&fit=crop&w=400&q=80', pref: 'Everything Bagel with Lox' },
  { id: 'pho', title: 'Pho', img: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80', pref: 'Beef Pho Noodle Soup' },
  { id: 'friedchicken', title: 'Fried Chicken', img: 'https://images.unsplash.com/photo-1626645738196-c2a7c8d08f58?auto=format&fit=crop&w=400&q=80', pref: 'Crispy Fried Chicken Bucket' },
  { id: 'indian', title: 'Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80', pref: 'Butter Chicken & Naan' },
  { id: 'gyro', title: 'Gyros', img: 'https://images.unsplash.com/photo-1633436342359-994326177e74?auto=format&fit=crop&w=400&q=80', pref: 'Lamb Gyro Wrap' },
  { id: 'kbbq', title: 'K-BBQ', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80', pref: 'Korean BBQ Ribs' },
  { id: 'pancakes', title: 'Pancakes', img: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=400&q=80', pref: 'Blueberry Pancakes' },
  { id: 'acai', title: 'Acai', img: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=400&q=80', pref: 'Acai Superfood Bowl' },
  { id: 'oysters', title: 'Oysters', img: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=400&q=80', pref: 'Fresh Local Oysters' },
  { id: 'hotdogs', title: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1541232390620-8a7403a6c247?auto=format&fit=crop&w=400&q=80', pref: 'Loaded Hot Dogs' },
];

export const TIER_1_AGENTS: Agent[] = [
  { name: "McDonald's", category: "Burgers", voice: "Hype, fast, legendary", moat: "Unbeatable speed", pricing: "Value" },
  { name: "Starbucks", category: "Morning Fuel", voice: "Chill, premium, custom", moat: "Caffeine & Vibes", pricing: "Moderate" },
  { name: "Chick-fil-A", category: "Chicken", voice: "Polite but competitive", moat: "The Quality Standard", pricing: "Moderate" },
  { name: "Taco Bell", category: "Late Night", voice: "Wild, bold, Live Mas", moat: "Crave-able deals", pricing: "Value" },
  { name: "Wendy's", category: "Burgers", voice: "Sassy, savage, fresh", moat: "The Baconator", pricing: "Value" },
  { name: "Burger King", category: "Burgers", voice: "King energy, flame-grilled", moat: "Flame flavor", pricing: "Value" },
  { name: "Dunkin'", category: "BOS Fuel", voice: "Local legend, straight talk", moat: "Boston Ubiquity", pricing: "Value" },
  { name: "Subway", category: "Fresh Subs", voice: "Healthy & Customizable", moat: "Eat Fresh", pricing: "Value" },
  { name: "Domino's", category: "Pizza Tech", voice: "Delivery masterminds", moat: "30-min flex", pricing: "Value" },
  { name: "Chipotle", category: "BOS Burritos", voice: "Macro-focused, clean", moat: "Protein Powerhouse", pricing: "Moderate" },
];

export const BOSTON_20_AGENTS: Agent[] = [
  { name: "Legal Sea Foods", category: "Seafood", neighborhood: "Seaport", specialty: "Clam Chowder", pricing: "Premium", voice: "Classy & Classic", moat: "Market Fresh" },
  { name: "Neptune Oyster", category: "Oysters", neighborhood: "North End", specialty: "Lobster Rolls", pricing: "High", voice: "Elite Tier", moat: "Culinary Icon" },
  { name: "Regina Pizzeria", category: "Pizza", neighborhood: "North End", specialty: "Brick Oven", pricing: "Moderate", voice: "OG Boston Pizzeria", moat: "The Real Deal" },
  { name: "Tasty Burger", category: "Burgers", neighborhood: "Fenway", specialty: "The Big Tasty", pricing: "Value", voice: "Ballpark Energy", moat: "Fenway Original" },
  { name: "Anna's Taqueria", category: "Mexican", neighborhood: "Brookline", specialty: "Super Burrito", pricing: "Value", voice: "Fast & Massive", moat: "The Burrito Heavyweight" },
  { name: "Flour Bakery", category: "Cafe", neighborhood: "South End", specialty: "Sandwiches", pricing: "Moderate", voice: "Sweet & Savory", moat: "Chef Joanne Chang" },
];
