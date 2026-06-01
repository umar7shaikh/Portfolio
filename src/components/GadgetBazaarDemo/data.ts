import type { Product } from "./chrome";

export const PRODUCTS: Product[] = [
  { name: "Boult Z40 Pro Earbuds", price: 1299, mrp: 2999, icon: "earbuds", tint: "#ECE6F2", badge: "TOP", rating: 4.7 },
  { name: "Silicone Case · iPhone 15", price: 349, mrp: 799, icon: "case", tint: "#E6EEF2", rating: 4.5 },
  { name: "65W GaN Fast Charger", price: 899, mrp: 1799, icon: "charger", tint: "#F2EEDF", badge: "SALE", rating: 4.8 },
  { name: "10000mAh Slim Power Bank", price: 1149, mrp: 1999, icon: "powerbank", tint: "#E6F0E8", rating: 4.6 },
  { name: "9H Tempered Glass · 2 pack", price: 199, mrp: 499, icon: "screen", tint: "#F0E8E6", rating: 4.4 },
  { name: "BoomPod 20W Speaker", price: 1799, mrp: 2999, icon: "speaker", tint: "#F2E7E7", badge: "TOP", rating: 4.7 },
  { name: "SmartFit Watch SE", price: 1999, mrp: 3499, icon: "watch", tint: "#E8EAF2", rating: 4.5 },
  { name: "Pro Gaming Controller", price: 1499, mrp: 2499, icon: "gamepad", tint: "#EAE7F2", rating: 4.6 },
];

export const CATEGORIES = [
  { label: "Earbuds", icon: "earbuds" },
  { label: "Mobile Covers", icon: "case" },
  { label: "Chargers", icon: "charger" },
  { label: "Power Banks", icon: "powerbank" },
  { label: "Screen Guards", icon: "screen" },
  { label: "Speakers", icon: "speaker" },
  { label: "Smartwatches", icon: "watch" },
  { label: "Gaming", icon: "gamepad" },
];
