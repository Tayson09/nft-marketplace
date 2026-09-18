# Checklist Final de Submissão — KURIO

## Gates eliminatórios

- [x] React usado efetivamente
- [x] TypeScript usado efetivamente
- [x] TanStack Router usado efetivamente
- [x] TanStack Query usado efetivamente
- [x] Axios usado efetivamente
- [x] Socket.IO client usado efetivamente
- [x] MSW usado na camada de rede
- [x] Playwright executável
- [x] Fluxo real de compra coberto por E2E
- [x] Confirmação de compra depende da decisão simulada
- [x] Eventos de tempo real passam pelo cliente Socket.IO
- [x] Dados privados separados por usuário na arquitetura mock

## Fluxos funcionais

- [x] Home
- [x] Busca
- [x] Filtros combináveis
- [x] Ordenação
- [x] Paginação
- [x] URL preserva parâmetros de busca
- [x] Detalhe do NFT
- [x] NFT inexistente
- [x] Favoritos
- [x] Carrinho
- [x] Persistência do carrinho
- [x] Cupom
- [x] Checkout
- [x] Carteira/rede simuladas
- [x] Idempotência de pedido
- [x] Pedido pendente
- [x] Pedido confirmado
- [x] Pagamento recusado
- [x] Perfil
- [x] Alteração de senha
- [x] Carteiras

## Tempo real

- [x] `nft.updated`
- [x] `order.updated`
- [x] Ordenação por versão
- [x] Ignora evento antigo
- [x] Ignora duplicata
- [x] Invalidação do cache afetado
- [x] Reconciliação após reconexão
- [ ] Verificar manualmente o cenário de alteração de preço na URL de produção
- [ ] Verificar manualmente retomada de pedido pendente na URL de produção

## E2E

- [x] Chromium desktop
- [x] Chromium mobile
- [x] Acessibilidade por teclado
- [x] Busca/filtro/ordenação/detalhe
- [x] Login + carrinho
- [x] Compra confirmada
- [x] Pagamento recusado
- [x] Perfil + carteiras
- [x] Tempo real
- [x] Resultado local confirmado: 14/14 testes
- [ ] Guardar `playwright-report/` final no repositório/artefato, se desejado

## Build e qualidade

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npm test`
- [ ] `npm run typecheck` explicitamente executado na sessão final (o build já executa `tsc -b`)
- [ ] Conferir `public/mockServiceWorker.js`
- [ ] Conferir `package-lock.json`
- [ ] Conferir que não há secrets reais no repositório

## Responsividade

- [x] 390px
- [x] 768px
- [x] 1440px
- [ ] Verificar manualmente o deploy nas três larguras

## Lighthouse

- [ ] Início — Mobile — execução 1
- [ ] Início — Mobile — execução 2
- [ ] Início — Mobile — execução 3
- [ ] Início — Desktop — execução 1
- [ ] Início — Desktop — execução 2
- [ ] Início — Desktop — execução 3
- [ ] Detalhe — Mobile — execução 1
- [ ] Detalhe — Mobile — execução 2
- [ ] Detalhe — Mobile — execução 3
- [ ] Detalhe — Desktop — execução 1
- [ ] Detalhe — Desktop — execução 2
- [ ] Detalhe — Desktop — execução 3
- [ ] Medianas calculadas
- [ ] LCP registrado
- [ ] CLS registrado
- [ ] TBT registrado
- [ ] HTMLs arquivados
- [ ] JSONs arquivados

## Deploy

- [x] Projeto Vercel criado
- [x] Preview deployment concluído
- [ ] Production deployment concluído
- [ ] Home pública verificada
- [ ] Acesso direto `/nft/nft-1` verificado
- [ ] Refresh de rota verificado
- [ ] Login verificado
- [ ] Checkout verificado
- [ ] Tempo real verificado

## Documentação

- [x] README final
- [x] ARCHITECTURE.md
- [ ] URL de produção adicionada ao README
- [ ] Relatórios Lighthouse adicionados
- [ ] Credenciais fictícias documentadas
- [ ] Comandos de setup documentados
- [ ] Cenários de falha documentados
- [ ] Limitações do Figma documentadas

## Entrega final

- [ ] `git status` limpo
- [ ] `git add .`
- [ ] `git commit -m "feat: complete NFT marketplace challenge"`
- [ ] `git push`
- [ ] URL pública copiada
- [ ] URL do repositório copiada
- [ ] README e relatórios revisados
