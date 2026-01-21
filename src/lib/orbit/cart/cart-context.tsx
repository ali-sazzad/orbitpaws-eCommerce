"use client";

import * as React from "react";
import type { CartLine, CartState } from "./types";
import { clearCartStorage, loadCart, saveCart } from "./storage";

type AddToCartInput = {
  productId: string;
  qty?: number;
  variantId?: string;
};

type CartContextValue = {
  state: CartState;
  hydrated: boolean;

  totalItems: number;
  add: (input: AddToCartInput) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

function makeLineId(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

const EMPTY: CartState = { lines: [] };

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<CartState>(EMPTY);
  const [hydrated, setHydrated] = React.useState(false);

  // SSR-safe hydrate (first render matches server)
  React.useEffect(() => {
    const saved = loadCart();
    if (saved?.lines) setState(saved);
    setHydrated(true);
  }, []);

  // persist after hydration
  React.useEffect(() => {
    if (!hydrated) return;
    saveCart(state);
  }, [state, hydrated]);

  const totalItems = React.useMemo(
    () => state.lines.reduce((sum, l) => sum + l.qty, 0),
    [state.lines]
  );

  const add = React.useCallback((input: AddToCartInput) => {
    const qty = Math.max(1, input.qty ?? 1);
    const lineId = makeLineId(input.productId, input.variantId);

    setState((prev) => {
      const existing = prev.lines.find((l) => l.lineId === lineId);

      if (existing) {
        const nextLines = prev.lines.map((l) =>
          l.lineId === lineId ? { ...l, qty: l.qty + qty } : l
        );
        return { lines: nextLines };
      }

      const next: CartLine = {
        lineId,
        productId: input.productId,
        variantId: input.variantId,
        qty,
      };
      return { lines: [...prev.lines, next] };
    });
  }, []);

  const remove = React.useCallback((lineId: string) => {
    setState((prev) => ({ lines: prev.lines.filter((l) => l.lineId !== lineId) }));
  }, []);

  const setQty = React.useCallback((lineId: string, qty: number) => {
    const nextQty = Math.max(1, qty);
    setState((prev) => ({
      lines: prev.lines.map((l) => (l.lineId === lineId ? { ...l, qty: nextQty } : l)),
    }));
  }, []);

  const clear = React.useCallback(() => {
    setState(EMPTY);
    clearCartStorage();
  }, []);

  const value: CartContextValue = {
    state,
    hydrated,
    totalItems,
    add,
    remove,
    setQty,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
