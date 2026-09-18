# Comandos finais de entrega

## Verificação local

```powershell
npm run lint
npm run typecheck
npm run build
npm test
```

## Preview/produção

```powershell
npm run preview
vercel deploy --prod
```

## Lighthouse

Defina a URL pública:

```powershell
$env:LIGHTHOUSE_BASE_URL="https://nft-marketplace-xi-wheat.vercel.app/"
npm run lighthouse
```

## Script do package.json

Adicionar/confirmar:

```json
"lighthouse": "node scripts/run-lighthouse.mjs"
```

## Artefatos gerados

```text
lighthouse-reports/
  home-mobile-run-1.html
  home-mobile-run-1.json
  ...
  detail-desktop-run-3.html
  detail-desktop-run-3.json
  summary.md
  summary.json
```
