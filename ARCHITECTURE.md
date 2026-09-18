# Architecture

## Responsibilities

- `src/routes`: navigation and page composition using TanStack Router.
- `src/api`: Axios transport and TanStack Query queries/mutations.
- `src/mocks`: MSW REST handlers, fixture database and WebSocket/Socket.IO mock integration.
- `src/realtime`: Socket.IO client, version ordering, invalidation and lifecycle.
- `src/auth`: session context and private-data isolation.
- `src/components`: reusable UI and NFT presentation.

## Cache policy

NFT list: 15s stale time, placeholder data keeps layout stable between pagination/filter changes.
Session: 30s stale time and no retry.
Cart: refreshed every 20s while visible because price/availability may change remotely.
Orders: refreshed every 3s while an order is active.
Mutations have no automatic retry to prevent duplicate operations.

## Optimistic update

Favorites use `onMutate` to update the cached list immediately and rollback on failure. The mutation is reconciled by a query invalidation after settling.

## Idempotency

Checkout stores a single idempotency key in `localStorage` for the active checkout attempt. The mock API returns the same order for a repeated key and rejects a missing key. This is the primary duplicate-click/timeout protection.

## REST/Socket reconciliation

REST is the source for durable snapshots. Socket.IO supplies low-latency updates. Events include resource id and version; the client keeps the highest observed version per resource and invalidates affected queries after accepted events. On reconnection the query cache is invalidated to reconcile against REST.

## Session policy

The bearer token is fictitious and equals the demo user id in the mock environment. It is not a password and never contains a real credential. Private TanStack Query cache is cleared on logout/session expiry.

## UX decisions

The design uses skeleton loading, visible focus, semantic labels, status copy that does not depend on color alone, and reduced-motion CSS handling. Layouts collapse at mobile widths with a touch-friendly header menu.

## Known limitation

The supplied Figma file was inaccessible to automated inspection in the development environment. The implementation therefore uses a clean visual substitute and external demo artwork URLs. The exact Figma assets and spacing should be swapped before the final handoff.
