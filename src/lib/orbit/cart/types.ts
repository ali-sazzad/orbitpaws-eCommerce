export type CartLine = {
  lineId: string; // unique per line (product + variant)
  productId: string;
  variantId?: string; // optional (size/flavour)
  qty: number;
};

export type CartState = {
  lines: CartLine[];
};
