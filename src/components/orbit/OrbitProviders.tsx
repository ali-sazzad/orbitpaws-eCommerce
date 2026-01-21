"use client";

import * as React from "react";
import { CartProvider } from "@/lib/orbit/cart/cart-context";
import { Toaster } from "sonner";

export function OrbitProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <Toaster richColors position="top-right" />
    </CartProvider>
  );
}
