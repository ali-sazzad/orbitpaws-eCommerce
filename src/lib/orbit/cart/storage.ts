import type { CartState } from "./types";

const KEY = "orbitpaws:cart:v1";

export function loadCart(): CartState | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CartState;
  } catch {
    return null;
  }
}

export function saveCart(state: CartState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function clearCartStorage() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
