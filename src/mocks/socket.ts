import { ws } from 'msw'

import {
  toSocketIo,
} from '@mswjs/socket.io-binding'

import {
  updateNftPrice,
} from './db'

const configuredUrl =
  import.meta.env.VITE_SOCKET_URL

const browserOrigin =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://127.0.0.1:5173'

const httpOrigin =
  configuredUrl ||
  browserOrigin

const socketOrigin =
  httpOrigin.startsWith('https://')
    ? httpOrigin.replace(
        /^https:/,
        'wss:',
      )
    : httpOrigin.replace(
        /^http:/,
        'ws:',
      )

const socketUrl =
  `${socketOrigin}/socket.io/`

const mockSocket =
  ws.link(socketUrl)

const isE2E =
  import.meta.env.VITE_E2E === 'true'

// No navegador normal,
// mantemos a alteração mais longa.
// Durante E2E, aceleramos o cenário
// para os testes não demorarem 18s.
const updateDelay =
  isE2E
    ? 5000
    : 18000

if (isE2E) {
  globalThis.setTimeout(() => {
    updateNftPrice('nft-1', '1.79', 2)
  }, updateDelay)
}

export const socketHandlers = [
  mockSocket.addEventListener(
    'connection',
    (connection) => {
      const { client } =
        toSocketIo(connection)

      client.emit(
        'connected',
        {
          resource: 'session',
          version: 1,
        },
      )

      const timer =
        globalThis.setTimeout(
          () => {
            const nft =
              updateNftPrice(
                'nft-1',
                '1.79',
                2,
              )

            if (!nft) {
              return
            }

            client.emit(
              'nft.updated',
              {
                resource: 'nft',
                id: nft.id,
                version:
                  nft.version,
                price: nft.price,
                available:
                  nft.available,
              },
            )
          },
          updateDelay,
        )

      connection.client.addEventListener(
        'close',
        () => {
          globalThis.clearTimeout(
            timer,
          )
        },
      )
    },
  ),
]