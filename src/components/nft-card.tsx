import {Heart, Plus} from 'lucide-react'
import {Link} from '@tanstack/react-router'
import type {NFT} from '../types'
import {Badge, Button, Card} from './ui'
import {eth} from '../lib/format'
import {useAddCart, useFavorites, useToggleFavorite} from '../api/hooks'
import {useAuth} from '../auth/context'

export function NFTCard({nft}: {nft: NFT}) {
  const {user} = useAuth()
  const {data: favorites = []} = useFavorites(Boolean(user))
  const favorite = favorites.includes(nft.id)
  const fav = useToggleFavorite()
  const add = useAddCart()
  return <Card className="group overflow-hidden rounded-[2px] border-[#3b2116] bg-[#1b100c] shadow-none">
    <div className="relative aspect-square overflow-hidden bg-[#e9eddc]">
      <Link to="/nft/$id" params={{id: nft.id}} className="block h-full"><img src={nft.image} alt={nft.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /></Link>
      <button onClick={() => user && fav.mutate({id: nft.id, favorite: !favorite})} className="absolute right-2 top-2 grid h-7 w-7 place-items-center border border-[#50301e] bg-[#120b08]/75 text-[#d8c4b4]" aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}><Heart size={13} fill={favorite ? 'currentColor' : 'none'} className={favorite ? 'text-[#e59a4f]' : ''}/></button>
      {nft.featured && <div className="absolute left-2 top-2"><Badge>Oferta</Badge></div>}
    </div>
    <div className="p-3">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link to="/nft/$id" params={{id: nft.id}} className="block truncate text-[12px] font-semibold text-[#efe1d4] hover:text-[#e59a4f]">{nft.name}</Link><div className="mt-1 text-[9px] text-[#927766]">{nft.collection}</div></div><div className="text-right"><div className="text-[8px] uppercase tracking-[.12em] text-[#725848]">Preço</div><div className="mt-1 text-[11px] font-bold text-[#df9550]">{eth(nft.price)}</div></div></div>
      <div className="mt-3 flex items-center justify-between border-t border-[#2f1b13] pt-3"><span className="text-[9px] text-[#775d4d]">{nft.available} disponíveis</span><Button size="sm" variant="secondary" className="h-7 rounded-[2px] px-2 text-[9px]" disabled={nft.available===0||add.isPending} onClick={() => add.mutate({nftId: nft.id, quantity: 1})}><Plus size={11}/>Adicionar</Button></div>
    </div>
  </Card>
}
