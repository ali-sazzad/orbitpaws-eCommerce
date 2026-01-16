# OrbitPaws — Vet-approved Pet Products Storefront (Frontend-only)

OrbitPaws is a deployable, frontend-only eCommerce storefront built to demonstrate real-world UI flows: product discovery (filters/search/sort), product detail UX, cart + checkout UI, and localStorage persistence — with accessibility and performance as first-class priorities.

## Why this exists
Junior portfolios often show “pretty pages” but skip the hard parts: state, edge cases, a11y, and UX polish. OrbitPaws intentionally covers those gaps.

## Features
- Product discovery: search + filters + sort + grid/list view
- Product detail UX: gallery, variants, stock handling, reviews (mock)
- Cart: add/remove/update quantity, shipping estimate, persistent cart
- Checkout UI-only: validated shipping form + success page
- Signature UI: Orbit3DProductCard (premium 3D spotlight, reduced-motion safe)
- Accessibility: keyboard navigation, focus-visible, semantic HTML
- SEO basics: metadata per route + OpenGraph defaults
- Performance: Next/Image, no heavy animation libraries

## Tech stack
- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- shadcn/ui (Radix primitives)

## Screenshots
> Add screenshots here:
- Home
- Shop (filters)
- Product detail
- Cart
- Checkout success

## Getting started
```bash
npm install
npm run dev
```