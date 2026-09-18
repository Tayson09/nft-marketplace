# KURIO — NFT Marketplace Challenge

React + TypeScript frontend challenge implementation focused on the required functional flows, resilient mocks, real-time updates and E2E coverage.

## Stack

React 19, TypeScript, Vite, TanStack Router, TanStack Query, Axios, MSW, Socket.IO client, Tailwind CSS, shadcn-style primitives/Radix UI, Typed form validation, Playwright and Lighthouse.

## Demo credentials

- `collector@nova.test` / `nova123`
- `maya@nova.test` / `nova123`

These are fictitious demo credentials only.

## Run

```bash
npm install
npm run mocks:init
npm run dev
```

The app is designed to run with `VITE_ENABLE_MOCKS=true` (default). Build with `npm run build` and preview with `npm run preview`.

## Required commands

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm test
npm run test:ui
npm run test:report
npm run lighthouse
```

## Deterministic mock scenarios

The REST layer exposes the reset endpoint `POST /api/__scenario/reset`. Core handlers simulate success, 4xx/5xx errors, variable latency, session expiration, invalid coupon, conflicts, stale quotes, duplicated order submissions through idempotency, payment rejection and pending recovery.

The browser mock emits `nft.updated` after approximately 18 seconds in normal development. During Playwright E2E runs (`VITE_E2E=true`), the scenario is accelerated to approximately 1.5 seconds. The client accepts only strictly newer event versions and ignores stale or duplicated events.

Use the in-app **Mock scenario** selector to switch between Normal, Slow network and Offline. The selector persists locally and is attached to Axios requests as `x-mock-scenario`. `POST /api/__scenario/reset` restores the mock catalog/account scenario.

## Test account isolation

Authentication is token-based in the mock API and all private resources are keyed by the authenticated user id. Logout clears the TanStack Query cache and real-time subscriptions are disconnected by the app lifecycle.

## Notes on the Figma

The supplied Figma URL could not be fetched programmatically in this environment, so the visual system in this starter is an original dark, editorial NFT marketplace treatment built from the written challenge requirements. Replace the image URLs and fine-grained design tokens with exported Figma assets before submission.

## Deployment

Vercel is supported with `vercel.json` route fallback. Because this implementation is a static frontend, the demo build keeps MSW enabled and does not require a private backend.

## Conteúdo visual da prototipação

A versão visual desta entrega foi aproximada a partir dos frames enviados como imagens na conversa. Os retratos dos NFTs visíveis na prototipação foram recortados e incluídos localmente em `public/assets/`, evitando dependência de URLs externas para as artes principais.

Assets disponíveis:
- `emerald-ape.png`
- `lavender-ape.png`
- `shadow-ape.png`
- `golden-ape.png`

Os textos principais reproduzem os conteúdos legíveis dos frames, incluindo o hero `SEJA DONO DO FUTURO DA ARTE DIGITAL`, `NFTA EM DESTAQUE`, `OFERTA LIMITADA`, carrinho, pagamento, confirmação, perfil e carteiras. Textos muito pequenos e ilegíveis nos screenshots foram adaptados semanticamente, sem inventar dados de negócio críticos.
