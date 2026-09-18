import {
  io,
  type Socket,
} from 'socket.io-client'

import type { QueryClient } from '@tanstack/react-query'

import { api } from '../api/client'
import { keys } from '../api/hooks'

import type {
  NFT,
  Order,
} from '../types'

type NftUpdated = {
  resource: 'nft'
  id: string
  version: number
  price: string
  available: number
}

type OrderUpdated = {
  resource: 'order'
  id: string
  version: number
  status: Order['status']
}

let socket: Socket | null = null

const seen = new Map<
  string,
  number
>()

function emitRealtimeEvent(
  detail: string,
) {
  window.dispatchEvent(
    new CustomEvent(
      'nova:realtime',
      {
        detail,
      },
    ),
  )
}

export function connectRealtime(
  queryClient: QueryClient,
) {
  if (socket) {
    return () =>
      disconnectRealtime()
  }

  const socketUrl =
    import.meta.env.VITE_SOCKET_URL ||
    undefined

  socket = io(socketUrl, {
    path: '/socket.io/',
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 500,
    autoConnect: true,
  })

  socket.on(
    'connect',
    () => {
      emitRealtimeEvent(
        'connected',
      )
    },
  )

  socket.on(
    'disconnect',
    () => {
      emitRealtimeEvent(
        'disconnected',
      )
    },
  )

  socket.on(
    'connect_error',
    () => {
      emitRealtimeEvent(
        'error',
      )
    },
  )

  socket.on(
    'nft.updated',
    (
      event: NftUpdated,
    ) => {
      const previousVersion =
        seen.get(event.id) ?? 0

      // Ignora eventos duplicados
      // ou mais antigos.
      if (
        event.version <=
        previousVersion
      ) {
        return
      }

      seen.set(
        event.id,
        event.version,
      )

      const current =
        queryClient.getQueryData<NFT>(
          keys.nft(event.id),
        )

      if (current) {
        queryClient.setQueryData<
          NFT
        >(
          keys.nft(event.id),
          {
            ...current,
            price: event.price,
            available:
              event.available,
            version:
              event.version,
          },
        )
      }

      // Atualiza catálogo,
      // carrinho e outras consultas
      // que dependem do NFT.
      queryClient.invalidateQueries({
        queryKey: keys.nfts,
      })

      queryClient.invalidateQueries({
        queryKey: keys.cart,
      })

      window.dispatchEvent(
        new CustomEvent(
          'nova:nft-updated',
          {
            detail: event,
          },
        ),
      )
    },
  )

  socket.on(
    'order.updated',
    (
      event: OrderUpdated,
    ) => {
      const key = `order:${event.id}`

      const previousVersion =
        seen.get(key) ?? 0

      if (
        event.version <=
        previousVersion
      ) {
        return
      }

      seen.set(
        key,
        event.version,
      )

      queryClient.invalidateQueries({
        queryKey:
          keys.order(event.id),
      })

      queryClient.invalidateQueries({
        queryKey: keys.orders,
      })
    },
  )

  return () =>
    disconnectRealtime()
}

export function disconnectRealtime() {
  socket?.disconnect()
  socket = null
  seen.clear()
}

export async function reconcileRealtime(
  queryClient: QueryClient,
) {
  await Promise.allSettled([
    queryClient.invalidateQueries({
      queryKey: keys.nfts,
    }),

    queryClient.invalidateQueries({
      queryKey: keys.cart,
    }),

    queryClient.invalidateQueries({
      queryKey: keys.orders,
    }),
  ])

  try {
    await api.get('/health')
  } catch {
    // A aplicação permanece utilizável
    // quando a rede simulada está offline.
  }
}