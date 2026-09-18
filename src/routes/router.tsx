import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'

import { AppLayout } from '../components/layout'
import { HomePage } from './home'
import { NFTPage } from './nft'
import { CartPage } from './cart'
import { CheckoutPage } from './checkout'
import { OrderPage } from './order'
import { LoginPage } from './login'
import { RegisterPage } from './register'
import { ProfilePage } from './profile'
import { WalletsPage } from './wallets'
import { NotFoundPage } from './not-found'
import { Protected } from './protected'

export type HomeSearch = {
  search?: string
  category?: string
  sort?: string
  page?: number
}

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
  notFoundComponent: NotFoundPage,
})

const validateHomeSearch = (
  search: Record<string, unknown>,
): HomeSearch => {
  const pageValue =
    typeof search.page === 'number'
      ? search.page
      : Number(search.page ?? 1)

  return {
    search:
      typeof search.search === 'string'
        ? search.search
        : undefined,

    category:
      typeof search.category === 'string'
        ? search.category
        : undefined,

    sort:
      typeof search.sort === 'string'
        ? search.sort
        : undefined,

    page:
      Number.isFinite(pageValue) && pageValue >= 1
        ? Math.floor(pageValue)
        : 1,
  }
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: validateHomeSearch,
  component: HomePage,
})

const nftRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'nft/$id',
  component: NFTPage,
})

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'cart',
  component: () => (
    <Protected>
      <CartPage />
    </Protected>
  ),
})

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'checkout',
  component: () => (
    <Protected>
      <CheckoutPage />
    </Protected>
  ),
})

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'order/$id',
  component: () => (
    <Protected>
      <OrderPage />
    </Protected>
  ),
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'profile',
  component: () => (
    <Protected>
      <ProfilePage />
    </Protected>
  ),
})

const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'wallets',
  component: () => (
    <Protected>
      <WalletsPage />
    </Protected>
  ),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',

  validateSearch: (search: Record<string, unknown>) => {
    const redirect =
      typeof search.redirect === 'string'
        ? search.redirect
        : undefined

    return redirect ? { redirect } : {}
  },

  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'register',
  component: RegisterPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  profileRoute,
  walletsRoute,
  loginRoute,
  registerRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}