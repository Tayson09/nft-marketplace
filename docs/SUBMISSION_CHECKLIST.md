# Submission checklist

- [ ] Replace demo image URLs with Figma exported assets if available.
- [ ] Run `npm install` and verify the generated `public/mockServiceWorker.js` is committed.
- [ ] Run `npm run typecheck` and `npm run lint`.
- [ ] Run `npm test` and keep `playwright-report/` as evaluator artifact if requested.
- [ ] Run `npm run lighthouse` on the optimized build and archive HTML/JSON output.
- [ ] Deploy to Vercel/Netlify/Cloudflare Pages.
- [ ] Verify direct navigation and refresh for `/nft/nft-1`, `/cart`, `/checkout`, `/order/<id>`, `/profile`, `/wallets`.
- [ ] Demonstrate the Socket.IO scenario and the Mock scenario selector in the submission video or README.
