import type {
  NFT,
  User,
  Wallet,
  Order,
} from '../types'

export const users: User[] = [
  {
    id: 'u1',
    email: 'collector@nova.test',
    name: 'Alex Morgan',
    avatar: '/assets/emerald-ape.png',
    passwordHash: 'demo-only-hash',
    createdAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'u2',
    email: 'maya@nova.test',
    name: 'Maya Chen',
    avatar: '/assets/golden-ape.png',
    passwordHash: 'demo-only-hash',
    createdAt: '2026-02-02T12:00:00Z',
  },
]

const art = [
  '/assets/emerald-ape.png',
  '/assets/lavender-ape.png',
  '/assets/shadow-ape.png',
  '/assets/golden-ape.png',
]

const names = [
  'Emerald Ape #652',
  'Violet Monkey #407',
  'Shadow Ape #091',
  'Golden Head #284',
  'Lavender King #118',
  'Urban Ape #314',
  'Emerald Ape #731',
  'Violet Monkey #441',
  'Shadow Ape #128',
  'Golden Head #301',
  'Emerald Ape #818',
  'Violet Monkey #520',
  'Shadow Ape #204',
  'Golden Head #348',
  'Lavender King #212',
  'Urban Ape #399',
  'Emerald Ape #920',
  'Golden Head #431',
]

export const nfts: NFT[] = Array.from(
  { length: 18 },
  (_, i) => {
    const image = art[i % art.length]

    return {
      id: `nft-${i + 1}`,

      name: names[i],

      collection:
        'Future Ape Collection',

      description:
        'Uma peça da coleção Future Ape, criada para quem quer possuir uma parte do futuro da arte digital. Cada edição combina personagem, cor e identidade em um item colecionável único.',

      image,

      gallery: [
        art[(i + 1) % art.length],
        art[(i + 2) % art.length],
        art[(i + 3) % art.length],
      ],

      // nft-1 começa em 1.49 ETH.
      // O mock de Socket.IO altera nft-1 para 1.79 ETH.
      price: (
        1.49 +
        (i % 6) * 0.31 +
        Math.floor(i / 6) * 0.12
      ).toFixed(2),

      floorPrice: (
        0.90 +
        (i % 4) * 0.15
      ).toFixed(2),

      currency: 'ETH',

      available:
        i % 7 === 0
          ? 1
          : 2 + (i % 4),

      edition: 652 + i,

      creator: [
        '0x2A6E…93A1',
        '0xB18A…32FD',
        '0x73C0…18ED',
      ][i % 3],

      category: [
        'Art',
        'Collectible',
        'Photography',
      ][i % 3],

      tags: [
        'featured',
        i % 2 ? 'limited' : 'rare',
      ],

      version: 1,

      featured: i < 4,
    }
  },
)

export const wallets: Record<
  string,
  Wallet[]
> = {
  u1: [
    {
      id: 'w1',
      name: 'Carteira principal',
      address:
        '0x7dB4a1D4cc0C3f5f17aD55e41C2C9D2A93C7aE81',
      network: 'Ethereum',
      isPrimary: true,
      connected: true,
    },
    {
      id: 'w2',
      name: 'Carteira secundária',
      address:
        '0x27cc1B8d08cE2Afe18F6c2e44D36c24FD1B9D91A',
      network: 'Polygon',
      isPrimary: false,
      connected: false,
    },
  ],

  u2: [
    {
      id: 'w3',
      name: 'Maya main',
      address:
        '0x86Bf1d9B84C8fD0e7A8f4C7d75cE5B0C3A1Ee228',
      network: 'Ethereum',
      isPrimary: true,
      connected: false,
    },
  ],
}

export const orders: Record<
  string,
  Order[]
> = {
  u1: [],
  u2: [],
}