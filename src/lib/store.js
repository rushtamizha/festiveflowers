'use client';

// All shopper data (cart, wishlist, profile, orders) lives in the browser's localStorage.
// There is no backend: nothing here ever leaves the device.

import { useSyncExternalStore } from 'react';
import { computeTotals } from './order';

function createMemoryStore(initial) {
  let state = initial;
  const listeners = new Set();
  const get = () => state;
  const set = (next) => {
    state = typeof next === 'function' ? next(state) : next;
    listeners.forEach((l) => l());
  };
  const subscribe = (l) => {
    listeners.add(l);
    return () => listeners.delete(l);
  };
  const useValue = () => useSyncExternalStore(subscribe, get, () => initial);
  return { get, set, subscribe, useValue };
}

function createPersistentStore(key, fallback) {
  let value = fallback;
  let loaded = false;
  const listeners = new Set();

  const readStorage = () => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const get = () => {
    if (!loaded) {
      loaded = true;
      value = readStorage();
    }
    return value;
  };

  const emit = () => listeners.forEach((l) => l());

  const set = (next) => {
    value = typeof next === 'function' ? next(get()) : next;
    loaded = true;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage unavailable (private mode / quota): keep working in memory.
    }
    emit();
  };

  // Keep several open tabs in sync.
  const onStorage = (event) => {
    if (event.key === key || event.key === null) {
      value = readStorage();
      emit();
    }
  };

  const subscribe = (l) => {
    if (listeners.size === 0) window.addEventListener('storage', onStorage);
    listeners.add(l);
    return () => {
      listeners.delete(l);
      if (listeners.size === 0) window.removeEventListener('storage', onStorage);
    };
  };

  // The server (and the first client render) always sees the fallback, so hydration matches.
  const useValue = () => useSyncExternalStore(subscribe, get, () => fallback);

  return { get, set, subscribe, useValue };
}

const EMPTY = [];

// In-memory UI state: cart drawer, toast, and the item most recently added to the cart.
const uiStore = createMemoryStore({ cartOpen: false, toast: null, lastAdded: null });

export const cartStore = createPersistentStore('wg:cart', EMPTY);
export const wishlistStore = createPersistentStore('wg:wishlist', EMPTY);
export const ordersStore = createPersistentStore('wg:orders', EMPTY);
export const userStore = createPersistentStore('wg:user', null);
export const recentStore = createPersistentStore('wg:recent-searches', EMPTY);

export const useCart = cartStore.useValue;
export const useWishlist = wishlistStore.useValue;
export const useOrders = ordersStore.useValue;
export const useUser = userStore.useValue;
export const useRecentSearches = recentStore.useValue;

// What gets saved for a product: just enough to draw a card or a cart line.
const snapshot = ({ id, slug, name, price, mrp, image, categoryName, rating, reviews, bestSeller, premium }) => ({
  id,
  slug,
  name,
  price,
  mrp,
  image,
  categoryName,
  rating,
  reviews,
  bestSeller,
  premium,
});

/* ------------------------------- cart ------------------------------- */

export function addToCart(product, qty = 1) {
  uiStore.set((s) => ({ ...s, lastAdded: { ...snapshot(product), qty, at: Date.now() } }));
  cartStore.set((items) => {
    if (items.some((i) => i.id === product.id)) {
      return items.map((i) => (i.id === product.id ? { ...i, qty: Math.min(99, i.qty + qty) } : i));
    }
    return [...items, { ...snapshot(product), qty: Math.min(99, qty) }];
  });
}

export function setCartQty(id, qty) {
  cartStore.set((items) =>
    qty < 1 ? items.filter((i) => i.id !== id) : items.map((i) => (i.id === id ? { ...i, qty: Math.min(99, qty) } : i)),
  );
}

export function removeFromCart(id) {
  cartStore.set((items) => items.filter((i) => i.id !== id));
}

export function clearCart() {
  cartStore.set(EMPTY);
}

export const cartCount = (items) => items.reduce((sum, i) => sum + i.qty, 0);
/** Full bill: MRP, discount, item total, GST, delivery, amount to pay and the order rules. */
export const cartTotals = (items) => computeTotals(items);

/* ----------------------------- wishlist ----------------------------- */

export function toggleWishlist(product) {
  const exists = wishlistStore.get().some((i) => i.id === product.id);
  wishlistStore.set((items) => (exists ? items.filter((i) => i.id !== product.id) : [...items, snapshot(product)]));
  return !exists;
}

/* ------------------------------ search ------------------------------ */

export function rememberSearch(term) {
  const value = term.trim();
  if (!value) return;
  recentStore.set((items) => [value, ...items.filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, 6));
}

/* ------------------------------ orders ------------------------------ */

export function placeOrder(customer) {
  const items = cartStore.get();
  const totals = computeTotals(items);
  const order = {
    id: `WG-${Date.now().toString(36).toUpperCase()}`,
    placedAt: new Date().toISOString(),
    items,
    totals,
    total: totals.total,
    customer,
  };
  ordersStore.set((orders) => [order, ...orders]);
  userStore.set((user) => ({ ...(user || {}), ...customer }));
  clearCart();
  return order;
}

/* -------------------------------- ui -------------------------------- */



export const useUi = uiStore.useValue;
export const openCart = () => uiStore.set((s) => ({ ...s, cartOpen: true }));
export const closeCart = () => uiStore.set((s) => ({ ...s, cartOpen: false }));
export const dismissLastAdded = () => uiStore.set((s) => ({ ...s, lastAdded: null }));

let toastTimer;
export function showToast(message) {
  uiStore.set((s) => ({ ...s, toast: { message, id: Date.now() } }));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => uiStore.set((s) => ({ ...s, toast: null })), 2600);
}
