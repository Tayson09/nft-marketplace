import {
  Link,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import {
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  WalletCards,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAuth } from '../auth/context'
import { useCart } from '../api/hooks'
import {
  getScenario,
  setScenario,
  type MockScenario,
} from '../mocks/scenarios'
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from './ui'

export function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout } = useAuth()

  const [
    scenario,
    setScenarioState,
  ] = useState<MockScenario>(
    getScenario(),
  )

  const { data } = useCart(Boolean(user))

  const [open, setOpen] =
    useState(false)

  const location = useLocation()

  const navigate = useNavigate()

  const count =
    data?.cart.items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    ) ?? 0

  useEffect(() => {
    const onScenarioChange = () => {
      setScenarioState(
        getScenario(),
      )
    }

    window.addEventListener(
      'nova:scenario',
      onScenarioChange,
    )

    return () =>
      window.removeEventListener(
        'nova:scenario',
        onScenarioChange,
      )
  }, [])

  const links = [
    ['/', 'Início'],
    ['/', 'Mercado'],
    ['/', 'Coleções'],
    ['/', 'Sobre nós'],
  ] as const

  return (
    <div className="min-h-screen bg-[#100b08] text-[#f7ede3]">
      <header className="sticky top-0 z-40 border-b border-[#3b2116] bg-[#100b08]/95 backdrop-blur">
        <div className="mx-auto flex h-[62px] max-w-[1180px] items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="KURIO início"
          >
            

            <span className="text-[13px] font-semibold tracking-[.32em] text-[#ead8c6]">
              KURIO
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map(
              ([to, label], index) => (
                <Link
                  key={label}
                  to={to}
                  className={`relative py-5 text-[12px] font-medium ${
                    index === 0 &&
                    location.pathname === '/'
                      ? 'text-[#f0a154]'
                      : 'text-[#a99689] hover:text-[#efe4da]'
                  }`}
                >
                  {label}

                  {index === 0 &&
                    location.pathname === '/' && (
                      <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d88b42]" />
                    )}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid h-9 w-9 place-items-center text-[#a99689] hover:text-[#f0a154]"
              aria-label="Pesquisar"
            >
              <Search size={16} />
            </button>

            <Link
              to="/cart"
              className="relative grid h-9 w-9 place-items-center text-[#a99689] hover:text-[#f0a154]"
              aria-label="Carrinho"
            >
              <ShoppingBag size={16} />

              {count > 0 && (
                <span className="absolute right-0 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#e09548] px-1 text-[9px] font-bold text-[#130c08]">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="ml-1 grid h-8 w-8 place-items-center overflow-hidden border border-[#5a3422] bg-[#26150f] text-[#d88b42]"
                aria-label="Perfil"
              >
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </Link>
            ) : (
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="ml-2 h-8 rounded-[2px] px-3 text-[11px]"
              >
                <Link
                  to="/login"
                  search={{}}
                >
                  Entrar
                </Link>
              </Button>
            )}

            <Dialog
              open={open}
              onOpenChange={setOpen}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="ml-1 grid h-9 w-9 place-items-center text-[#a99689] md:hidden"
                  aria-label="Abrir menu"
                >
                  <Menu size={18} />
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-sm rounded-sm border-[#4d2819] bg-[#1a0f0b]">
                <DialogTitle className="text-lg text-[#f7ede3]">
                  Menu
                </DialogTitle>

                <div className="mt-6 grid gap-2">
                  {links
                    .slice(0, 2)
                    .map(([to, label]) => (
                      <Link
                        onClick={() =>
                          setOpen(false)
                        }
                        key={label}
                        to={to}
                        className="border border-[#3b2116] px-4 py-3 text-sm text-[#d8c5b4]"
                      >
                        {label}
                      </Link>
                    ))}

                  <Link
                    onClick={() =>
                      setOpen(false)
                    }
                    to="/cart"
                    className="border border-[#3b2116] px-4 py-3 text-sm text-[#d8c5b4]"
                  >
                    Carrinho
                  </Link>

                  {user ? (
                    <button
                      type="button"
                      onClick={async () => {
                        setOpen(false)
                        await logout()
                        navigate({
                          to: '/',
                        })
                      }}
                      className="flex items-center gap-2 border border-[#3b2116] px-4 py-3 text-left text-sm text-[#d8c5b4]"
                    >
                      <LogOut size={15} />
                      Sair
                    </button>
                  ) : null}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1180px] justify-end px-4 pt-2 sm:px-6">
        <label className="flex items-center gap-2 text-[9px] uppercase tracking-[.18em] text-[#5e473b]">
          Cenário

          <select
            aria-label="Cenário do mock"
            value={scenario}
            onChange={(event) => {
              const next =
                event.target
                  .value as MockScenario

              setScenario(next)
              setScenarioState(next)
            }}
            className="bg-transparent text-[9px] text-[#806857] outline-none"
          >
            <option value="normal">
              Normal
            </option>

            <option value="slow">
              Lento
            </option>

            <option value="offline">
              Offline
            </option>
          </select>
        </label>
      </div>

      <main>{children}</main>

      <footer className="mx-auto mt-12 max-w-[1180px] border-t border-[#3b2116] px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-4">
          <div>
            <div className="text-[12px] font-bold tracking-[.3em] text-[#e5d1bf]">
              NOVA
            </div>

            <p className="mt-3 text-[10px] leading-5 text-[#7a6253]">
              Uma galeria digital para
              colecionadores e novas
              histórias.
            </p>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cf8340]">
              NOVA
            </div>

            <div className="mt-3 space-y-2 text-[10px] text-[#7a6253]">
              <div>
                Sobre nós
              </div>

              <div>
                Como funciona
              </div>

              <div>
                Termos de uso
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cf8340]">
              Suporte
            </div>

            <div className="mt-3 space-y-2 text-[10px] text-[#7a6253]">
              <div>
                Central de ajuda
              </div>

              <div>
                Fale conosco
              </div>

              <div>
                FAQ
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#cf8340]">
              Redes
            </div>

            <div className="mt-3 flex gap-2 text-[10px] text-[#8c6e59]">
              <span className="border border-[#4a281b] px-2 py-1">
                IG
              </span>

              <span className="border border-[#4a281b] px-2 py-1">
                X
              </span>

              <span className="border border-[#4a281b] px-2 py-1">
                DS
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#2a1912] pt-4 text-[9px] text-[#604a3c]">
          <span>
            © 2026 NOVA. Todos os direitos
            reservados.
          </span>

          <span className="inline-flex items-center gap-2">
            <WalletCards size={12} />
            ambiente de demonstração
          </span>
        </div>
      </footer>
    </div>
  )
}