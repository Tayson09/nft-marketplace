import { useState } from 'react'
import {
  ChevronRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react'
import {
  useNavigate,
  useSearch,
} from '@tanstack/react-router'

import type { HomeSearch } from './router'
import { useNfts } from '../api/hooks'
import { NFTCard } from '../components/nft-card'
import {
  Button,
  Card,
  EmptyState,
  Skeleton,
} from '../components/ui'

export function HomePage() {
  const navigate = useNavigate({
    from: '/',
  })

  const search = useSearch({
    from: '/',
  })

  const [q, setQ] = useState(
    String(search.search ?? ''),
  )

  const page = Number(search.page ?? 1)

  const params = {
    search: String(search.search ?? ''),
    category: String(search.category ?? 'all'),
    sort: String(search.sort ?? 'featured'),
    page,
    size: 9,
  }

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useNfts(params)

  const categories = [
    'all',
    'Art',
    'Collectible',
    'Photography',
  ]

  const featured =
    data?.items
      .filter((item) => item.featured)
      .slice(0, 3) ?? []

  const activeCategory = String(
    search.category ?? 'all',
  )

  const update = (
    next: Partial<HomeSearch>,
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...next,
        page: next.page ?? 1,
      }),
    })
  }

  const green =
    '/assets/emerald-ape.png'

  return (
    <div className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6">
      <section className="grid gap-0 overflow-hidden border border-[#3a2117] bg-[#160d0a] lg:grid-cols-[1.12fr_.88fr]">
        <div className="flex min-h-[360px] flex-col justify-center border-b border-[#3a2117] px-7 py-10 sm:px-10 lg:border-b-0 lg:border-r">
          <div className="text-[9px] uppercase tracking-[.22em] text-[#9d6d4c]">
            Future Ape Collection
          </div>

          <h1 className="mt-6 max-w-xl text-[42px] font-semibold leading-[.97] tracking-[-.04em] text-[#f3e7dd] sm:text-[58px]">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>

          <p className="mt-5 max-w-md text-[11px] leading-6 text-[#8c7162]">
            Descubra peças exclusivas,
            acompanhe novas edições e construa
            uma coleção que representa a próxima
            geração da arte.
          </p>

          <div className="mt-6">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 rounded-[2px] px-4 text-[10px]"
              onClick={() =>
                document
                  .getElementById('marketplace')
                  ?.scrollIntoView({
                    behavior: 'smooth',
                  })
              }
            >
              EXPLORAR
              <ChevronRight size={13} />
            </Button>
          </div>
        </div>

        <div className="relative min-h-[360px] bg-[#eae8d9] p-4 sm:p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_35%,rgba(227,148,75,.28),transparent_40%)]" />

          <img
            src={green}
            alt="Emerald Ape em jaqueta verde"
            className="relative h-full min-h-[330px] w-full object-cover object-center"
          />
        </div>
      </section>

      <section
        id="marketplace"
        className="mt-9"
      >
        <div className="grid gap-8 lg:grid-cols-[190px_1fr]">
          <aside className="hidden lg:block">
            <div className="text-[11px] font-semibold text-[#cbb4a4]">
              Coleções
            </div>

            <div className="mt-4 space-y-2 text-[9px] text-[#755c4e]">
              {[
                'Future Ape',
                'Rare Animals',
                'Digital Arts',
                'Limited',
                'Genesis',
                'New Arrivals',
              ].map((collection, index) => (
                <div
                  key={collection}
                  className="flex items-center justify-between border-b border-[#271711] pb-2"
                >
                  <span>
                    {collection}
                  </span>

                  <span>
                    {
                      [24, 12, 8, 6, 4, 10][
                        index
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 text-[11px] font-semibold text-[#cbb4a4]">
              Faixa de preço
            </div>

            <div className="mt-3 h-1 bg-[#55301e]">
              <div className="h-1 w-3/4 bg-[#d78942]" />
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-[#7b604f]">
              <span>0.80 ETH</span>
              <span>4.50 ETH</span>
            </div>

            <Button
              size="sm"
              variant="secondary"
              className="mt-3 h-7 rounded-[2px] px-3 text-[9px]"
            >
              Aplicar
            </Button>

            <div className="mt-7 text-[11px] font-semibold text-[#cbb4a4]">
              Rede
            </div>

            <div className="mt-3 space-y-2 text-[9px] text-[#795f51]">
              <div>
                Ethereum
                <span className="float-right">
                  170
                </span>
              </div>

              <div>
                Polygon
                <span className="float-right">
                  80
                </span>
              </div>

              <div>
                Solana
                <span className="float-right">
                  40
                </span>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase tracking-[.2em] text-[#9a6a49]">
                  Ofertas
                </div>

                <h2 className="mt-2 text-2xl font-semibold text-[#efe0d4]">
                  NFT EM DESTAQUE
                </h2>
              </div>

              <div className="text-[9px] text-[#735848]">
                {data?.total ?? 0} itens
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2 border-y border-[#2b1912] py-2 md:flex-row">
              <div className="relative flex-1">
                <Search
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#715444]"
                />

                <input
                  value={q}
                  onChange={(event) =>
                    setQ(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      update({
                        search: q,
                        page: 1,
                      })
                    }
                  }}
                  placeholder="Busque por nome ou coleção"
                  aria-label="Buscar NFT"
                  className="h-9 w-full rounded-[2px] border border-[#3b2116] bg-[#170d09] pl-9 pr-3 text-[10px] text-[#eadacf] outline-none focus:border-[#9e5e29]"
                />
              </div>

              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      update({
                        category,
                        page: 1,
                      })
                    }
                    className={`h-9 rounded-[2px] border px-3 text-[9px] ${
                      activeCategory === category
                        ? 'border-[#a25e2b] bg-[#5b311d] text-[#f4c18f]'
                        : 'border-[#3b2116] text-[#7c6253]'
                    }`}
                  >
                    {category === 'all'
                      ? 'Tudo'
                      : category}
                  </button>
                ))}

                <select
                  aria-label="Ordenação"
                  value={String(
                    search.sort ??
                      'featured',
                  )}
                  onChange={(event) =>
                    update({
                      sort: event.target.value,
                      page: 1,
                    })
                  }
                  className="h-9 rounded-[2px] border border-[#3b2116] bg-[#170d09] px-3 text-[9px] text-[#b4937f] outline-none"
                >
                  <option value="featured">
                    Destaques
                  </option>
                  <option value="newest">
                    Mais novos
                  </option>
                  <option value="price-asc">
                    Menor preço
                  </option>
                  <option value="price-desc">
                    Maior preço
                  </option>
                </select>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-9 rounded-[2px] px-3 text-[9px]"
                >
                  <SlidersHorizontal size={12} />
                  Filtros
                </Button>
              </div>
            </div>

            {featured.length > 0 && (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {featured.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[.18em] text-[#9a6a49]">
                  Mais colecionáveis
                </div>

                <h2 className="mt-2 text-xl font-semibold text-[#efe0d4]">
                  OFERTA LIMITADA
                </h2>
              </div>

              <div className="text-[9px] text-[#755b4d]">
                Página {data?.page ?? page} /{' '}
                {data?.pages ?? 1}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {isError ? (
                <div className="sm:col-span-2 xl:col-span-3">
                  <EmptyState
                    title="Não foi possível carregar"
                    description="O mock de rede retornou um erro. Tente novamente."
                    action={
                      <Button
                        onClick={() =>
                          refetch()
                        }
                      >
                        Tentar novamente
                      </Button>
                    }
                  />
                </div>
              ) : isLoading ? (
                Array.from({
                  length: 6,
                }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-square rounded-[2px]"
                  />
                ))
              ) : data?.items.length ? (
                data.items.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                  />
                ))
              ) : (
                <div className="sm:col-span-2 xl:col-span-3">
                  <EmptyState
                    title="Nenhum NFT encontrado"
                    description="Tente outra busca ou categoria."
                    action={
                      <Button
                        onClick={() =>
                          update({
                            search: '',
                            category: 'all',
                            page: 1,
                          })
                        }
                      >
                        Limpar
                      </Button>
                    }
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                className="rounded-[2px] text-[9px]"
                onClick={() =>
                  update({
                    page: page - 1,
                  })
                }
              >
                Anterior
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled={
                  !data ||
                  page >= data.pages
                }
                className="rounded-[2px] text-[9px]"
                onClick={() =>
                  update({
                    page: page + 1,
                  })
                }
              >
                Próxima
                <ChevronRight size={12} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 border-t border-[#3b2116] pt-8">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[.18em] text-[#a36c47]">
            NOVA
          </div>

          <h2 className="mt-2 text-xl font-semibold text-[#eeded0]">
            Dúvidas da Coleção
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-[10px] leading-5 text-[#7c6051]">
            Encontre uma curadoria de obras
            e acompanhe tudo que acontece no
            universo digital.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            [
              'Mercado em constante evolução',
              'Acompanhe novos lançamentos e ofertas.',
            ],
            [
              'Coleções especiais',
              'Peças selecionadas para colecionadores.',
            ],
            [
              'Histórias de lançamento',
              'Conheça a origem de cada peça.',
            ],
            [
              'Atendimento próximo',
              'Fale com nosso time quando precisar.',
            ],
          ].map(([title, description]) => (
            <Card
              key={title}
              className="rounded-[2px] border-[#3b2116] bg-[#190f0b] p-4 shadow-none"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[#c67d3b] text-[10px] font-bold text-[#1a0f0a]">
                N
              </div>

              <div className="mt-3 text-[10px] font-semibold text-[#d9c0ad]">
                {title}
              </div>

              <p className="mt-2 text-[9px] leading-5 text-[#755b4d]">
                {description}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}