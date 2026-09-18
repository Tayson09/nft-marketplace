import {useState} from 'react'
import {Link, useNavigate, useParams} from '@tanstack/react-router'
import {Heart, Minus, Plus, ArrowLeft, ShieldCheck, CircleHelp} from 'lucide-react'
import {useAddCart, useFavorites, useNft, useToggleFavorite} from '../api/hooks'
import {useAuth} from '../auth/context'
import {eth, shortenAddress} from '../lib/format'
import {Badge, Button, Card, EmptyState, Skeleton} from '../components/ui'
import {NFTCard} from '../components/nft-card'
import {useNfts} from '../api/hooks'

export function NFTPage() {
  const {user} = useAuth()
  const {id} = useParams({from: '/nft/$id'})
  const {data: nft, isLoading, isError} = useNft(id)
  const {data: favorites = []} = useFavorites(Boolean(user))
  const fav = useToggleFavorite()
  const add = useAddCart()
  const nav = useNavigate()
  const [qty, setQty] = useState(1)
  const {data: related} = useNfts({search:'', category:'all', sort:'featured', page:1, size:9})

  if (isLoading) return <div className="mx-auto max-w-[1180px] px-4 py-10"><div className="grid gap-8 lg:grid-cols-[1fr_.9fr]"><Skeleton className="aspect-square"/><div className="space-y-4"><Skeleton className="h-8 w-2/3"/><Skeleton className="h-24"/><Skeleton className="h-12"/></div></div></div>
  if (isError || !nft) return <div className="mx-auto max-w-[1180px] px-4 py-20"><EmptyState title="NFT não encontrado" description="Esse item pode ter sido removido ou o endereço não é válido." action={<Button asChild><Link to="/">Voltar ao mercado</Link></Button>}/></div>

  const favorite = favorites.includes(id)
  const submit = () => add.mutate({nftId:id, quantity:qty}, {onSuccess:() => nav({to:'/cart'})})
  const others = (related?.items ?? []).filter(x => x.id !== nft.id).slice(0, 5)

  return <div className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6">
    <Link to="/" className="mb-5 mt-5 inline-flex items-center gap-2 text-[10px] text-[#7b5f4f] hover:text-[#df9550]"><ArrowLeft size={13}/> Voltar para o mercado</Link>
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-[78px_1fr]">
        <div className="order-2 grid grid-cols-4 gap-2 sm:order-1 sm:grid-cols-1">{[nft.image, ...nft.gallery].map((img, i) => <img key={`${img}-${i}`} src={img} alt={`${nft.name} vista ${i+1}`} className="aspect-square w-full border border-[#412519] bg-[#dfe7d4] object-cover" />)}</div>
        <div className="order-1 overflow-hidden border border-[#4d2a1a] bg-[#e8eadc] sm:order-2"><img src={nft.image} alt={nft.name} className="aspect-square w-full object-cover"/></div>
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-2"><Badge>{nft.category}</Badge><Badge muted>Edição limitada</Badge></div>
        <h1 className="mt-4 text-[34px] font-semibold leading-none tracking-[-.04em] text-[#f0e3d7] sm:text-[44px]">{nft.name}</h1>
        <div className="mt-2 text-[10px] text-[#8a6e5c]">{nft.collection} · Edição #{nft.edition}</div>
        <div className="mt-5 flex items-end gap-7"><div><div className="text-[9px] uppercase tracking-[.16em] text-[#765849]">Preço</div><div className="mt-1 text-[24px] font-semibold text-[#df9550]">{eth(nft.price)}</div></div><div className="text-[10px] text-[#a67d62]">★★★★★ <span className="ml-1 text-[#715748]">4.9 · avaliações da comunidade</span></div></div>
        <p className="mt-6 text-[11px] leading-6 text-[#8e7464]">{nft.description}</p>
        <div className="mt-6 border-y border-[#3b2116] py-5"><div className="text-[9px] uppercase tracking-[.15em] text-[#765849]">Quantidade</div><div className="mt-2 flex items-center justify-between"><div className="text-[10px] text-[#876b5c]">Disponíveis: {nft.available}</div><div className="flex items-center border border-[#4a291b] bg-[#160c09]"><button className="grid h-8 w-8 place-items-center text-[#b3927e] hover:text-[#e9a15b]" onClick={()=>setQty(q=>Math.max(1,q-1))} aria-label="Diminuir quantidade"><Minus size={13}/></button><div className="w-8 text-center text-[11px]">{qty}</div><button className="grid h-8 w-8 place-items-center text-[#b3927e] hover:text-[#e9a15b]" onClick={()=>setQty(q=>Math.min(nft.available,q+1))} aria-label="Aumentar quantidade"><Plus size={13}/></button></div></div></div>
        <div className="mt-4 grid grid-cols-[1fr_48px] gap-2"><Button size="lg" className="rounded-[2px]" onClick={submit} disabled={add.isPending || nft.available === 0}>{add.isPending ? 'Adicionando...' : 'Comprar agora'}</Button><Button size="lg" variant="outline" className="rounded-[2px]" onClick={()=>fav.mutate({id, favorite:!favorite})} aria-label="Favoritar"><Heart size={16} fill={favorite?'currentColor':'none'} className={favorite?'text-[#e59a4f]':''}/></Button></div>
        <div className="mt-4 grid grid-cols-2 gap-2"><Card className="rounded-[2px] p-3"><div className="text-[8px] uppercase tracking-[.14em] text-[#6f5447]">Criador</div><div className="mt-2 text-[10px] text-[#cdb7a8]">{shortenAddress(nft.creator)}</div></Card><Card className="rounded-[2px] p-3"><div className="text-[8px] uppercase tracking-[.14em] text-[#6f5447]">Preço mínimo</div><div className="mt-2 text-[10px] text-[#cdb7a8]">{eth(nft.floorPrice)}</div></Card></div>
        <div className="mt-4 flex items-start gap-2 text-[9px] leading-5 text-[#705548]"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#c67d3b]"/>Compra simulada protegida. Preço, disponibilidade, cupom e taxa são revalidados antes da confirmação.</div>
      </div>
    </div>
    <section className="mt-12 border-t border-[#3b2116] pt-8"><div className="flex items-center justify-between"><div><div className="text-[9px] uppercase tracking-[.2em] text-[#9a6847]">Mais obras</div><h2 className="mt-2 text-xl font-semibold text-[#eadcd0]">Mais NFTs da coleção</h2></div><CircleHelp size={14} className="text-[#765a4b]"/></div><div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">{others.map(n=><NFTCard key={n.id} nft={n}/>)}</div></section>
  </div>
}
