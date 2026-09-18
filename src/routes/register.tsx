import {
  useState,
  type FormEvent,
} from 'react'

import {
  Link,
  useNavigate,
} from '@tanstack/react-router'

import { ArrowRight } from 'lucide-react'

import {
  Button,
  Card,
  Input,
} from '../components/ui'

import { useAuth } from '../auth/context'

export function RegisterPage() {
  const { register } = useAuth()

  const navigate = useNavigate({
    from: '/register',
  })

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('nova123')

  const [error, setError] =
    useState('')

  const submit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    setError('')

    if (name.trim().length < 2) {
      setError(
        'Nome deve ter ao menos 2 caracteres.',
      )
      return
    }

    if (password.length < 8) {
      setError(
        'Senha deve ter ao menos 8 caracteres.',
      )
      return
    }

    try {
      await register(
        name.trim(),
        email.trim(),
        password,
      )

      navigate({
        to: '/',
      })
    } catch {
      setError(
        'Esse e-mail já possui cadastro ou os dados são inválidos.',
      )
    }
  }

  return (
    <div className="relative mx-auto min-h-[calc(100vh-120px)] max-w-[1180px] px-4 py-10 sm:px-6">
      <div className="grid overflow-hidden border border-[#3b2116] bg-[#160d0a] lg:grid-cols-[1.18fr_.82fr]">
        <div className="relative hidden min-h-[560px] lg:block">
          <img
            src="/assets/emerald-ape.png"
            alt="Arte Emerald Ape"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#160d0a]/50 to-[#160d0a]" />

          <div className="absolute left-8 top-10">
            <div className="text-[9px] uppercase tracking-[.2em] text-[#cc7d3b]">
              Nova conta
            </div>

            <h2 className="mt-4 text-4xl font-semibold leading-none text-[#f2e5d9]">
              ENTRE PARA O FUTURO
              <br />
              DA ARTE DIGITAL
            </h2>
          </div>
        </div>

        <Card className="rounded-none border-0 bg-[#1b100c] p-8 sm:p-10 lg:min-h-[560px] lg:border-l lg:border-[#3b2116]">
          <div className="text-[11px] font-semibold tracking-[.3em] text-[#ddcaba]">
            NOVA
          </div>

          <h1 className="mt-8 text-2xl font-semibold text-[#eee0d4]">
            Criar cadastro
          </h1>

          <p className="mt-2 text-[10px] leading-5 text-[#785e50]">
            Cadastre uma conta fictícia
            para testar favoritos,
            carrinho e checkout.
          </p>

          <form
            onSubmit={submit}
            className="mt-7 space-y-4"
          >
            <label className="block text-[10px] text-[#b8947f]">
              Nome

              <Input
                className="mt-2"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
                autoComplete="name"
              />
            </label>

            <label className="block text-[10px] text-[#b8947f]">
              E-mail

              <Input
                className="mt-2"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                autoComplete="email"
              />
            </label>

            <label className="block text-[10px] text-[#b8947f]">
              Senha

              <Input
                className="mt-2"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
            </label>

            {error && (
              <p className="border border-[#68401f] bg-[#3d2516] p-3 text-[9px] text-[#e1a06a]">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-[2px]"
              size="lg"
            >
              Criar conta
              <ArrowRight size={14} />
            </Button>
          </form>

          <p className="mt-5 text-center text-[9px] text-[#745a4b]">
            Já possui conta?{' '}
            <Link
              to="/login"
              search={{}}
              className="text-[#dd9550]"
            >
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}