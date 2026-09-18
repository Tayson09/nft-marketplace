# Lighthouse reports

Os relatórios finais devem ser gerados pelo projeto publicado/preview com:

```powershell
$env:LIGHTHOUSE_BASE_URL="https://nft-marketplace-xi-wheat.vercel.app/"
npm run lighthouse
```

O script executa 3 medições para cada combinação:

- Home / mobile
- Home / desktop
- Detalhe / mobile
- Detalhe / desktop

Ele salva um HTML e um JSON por execução e também:

- `summary.json`
- `summary.md`

As métricas agregadas são Performance, Accessibility, Best Practices, SEO, LCP, CLS e TBT.

**Não há números fictícios neste diretório.** A medição precisa ser executada no ambiente final para representar as condições reais da entrega.
