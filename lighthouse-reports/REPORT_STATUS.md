# Status dos relatórios Lighthouse

Os relatórios numéricos finais não foram preenchidos artificialmente porque a URL de deployment não pôde ser executada neste ambiente de criação de artefatos.

Para gerar os relatórios reais na máquina de entrega:

```powershell
$env:LIGHTHOUSE_BASE_URL="https://nft-marketplace-xi-wheat.vercel.app/"
npm run lighthouse
```

O script executará as 12 auditorias exigidas pelo desafio (2 páginas × 2 perfis × 3 execuções) e calculará as medianas automaticamente.
