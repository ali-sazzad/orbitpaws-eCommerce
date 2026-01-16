// src/data/products.ts
export type PetCategory = "cat" | "dog" | "both";
export type ProductType = "food" | "toy" | "grooming";

export type ProductVariant = {
  id: string;
  label: string;
  priceDelta?: number;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: PetCategory;
  type: ProductType;
  rating: number;
  image: string;
  tags: string[];
  stock: number;
  vetApproved: boolean;
  popularity: number;
  variants?: ProductVariant[];
};

export const products: Product[] = [
  {
    id: "op-001",
    name: "OrbitVet Salmon Bites (Sensitive Stomach)",
    price: 32,
    category: "cat",
    type: "food",
    rating: 4.7,
    image: "/images/products/salmon-bites.jpg",
    tags: ["safe ingredients", "grain-free", "vet-approved"],
    stock: 24,
    vetApproved: true,
    popularity: 92,
    variants: [
      { id: "v-001a", label: "250g", stock: 18 },
      { id: "v-001b", label: "500g", priceDelta: 10, stock: 6 },
    ],
  },
  {
    id: "op-002",
    name: "CalmPaws Dental Chew (Vet Formula)",
    price: 18,
    category: "dog",
    type: "food",
    rating: 4.5,
    image: "/images/products/dental-chew.jpg",
    tags: ["fresh breath", "vet-approved", "30-day returns"],
    stock: 40,
    vetApproved: true,
    popularity: 86,
    variants: [
      { id: "v-002a", label: "Small Dogs", stock: 14 },
      { id: "v-002b", label: "Medium Dogs", stock: 16 },
      { id: "v-002c", label: "Large Dogs", stock: 10 },
    ],
  },
  {
    id: "op-003",
    name: "HypoSoft Shampoo (No Harsh Fragrance)",
    price: 21,
    category: "both",
    type: "grooming",
    rating: 4.6,
    image: "/images/products/hyposoft-shampoo.jpg",
    tags: ["safe ingredients", "skin-friendly", "fast delivery"],
    stock: 12,
    vetApproved: true,
    popularity: 73,
  },
  {
    id: "op-004",
    name: "OrbitPlay Tug Rope (Reinforced Core)",
    price: 14,
    category: "dog",
    type: "toy",
    rating: 4.2,
    image: "/images/products/tug-rope.jpg",
    tags: ["durable", "training", "fast delivery"],
    stock: 0,
    vetApproved: false,
    popularity: 64,
  },
  {
    id: "op-005",
    name: "QuietWhisker Feather Wand (Low-Shed)",
    price: 12,
    category: "cat",
    type: "toy",
    rating: 4.4,
    image: "/images/products/feather-wand.jpg",
    tags: ["indoor play", "safe materials", "30-day returns"],
    stock: 33,
    vetApproved: true,
    popularity: 78,
  },
  {
    id: "op-006",
    name: "JointCare Omega Oil (Vet Blend)",
    price: 27,
    category: "both",
    type: "food",
    rating: 4.8,
    image: "/images/products/omega-oil.jpg",
    tags: ["mobility", "vet-approved", "safe ingredients"],
    stock: 9,
    vetApproved: true,
    popularity: 95,
  },
  {
    id: "op-007",
    name: "PawGuard Nail Trimmer (Safety Stop)",
    price: 16,
    category: "both",
    type: "grooming",
    rating: 4.3,
    image: "/images/products/nail-trimmer.jpg",
    tags: ["easy grip", "safe design", "fast delivery"],
    stock: 20,
    vetApproved: true,
    popularity: 70,
  },
  {
    id: "op-008",
    name: "PureBowl Slow Feeder (Anti-Gulp)",
    price: 19,
    category: "dog",
    type: "grooming",
    rating: 4.1,
    image: "/images/products/slow-feeder.jpg",
    tags: ["digestive support", "dishwasher safe", "returns"],
    stock: 15,
    vetApproved: false,
    popularity: 60,
  },
];

export const featuredProducts = products
  .slice()
  .sort((a, b) => b.popularity - a.popularity)
  .slice(0, 4);
