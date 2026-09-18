import {Link, useNavigate} from '@tanstack/react-router'
import {Minus, Plus, Trash2, Tag, ArrowRight, RefreshCw, ShieldCheck} from 'lucide-react'
import {useState} from 'react'
import {useCart, useCoupon, useNft, useRemoveCart, useRemoveCoupon, useCartQuantity} from '../api/hooks'
import type {CartItem} from '../types'
import {eth} from '../lib/format'
import {Button, Card, EmptyState, Skeleton} from '../components/ui'

function CartLine({
  item,
  qty,
  remove,
}: {
  item: CartItem
  qty: ReturnType<typeof useCartQuantity>
  remove: ReturnType<typeof useRemoveCart>
}) {
  const { data: nft } = useNft(item.nftId)

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-[#332016] py-3 last:border-0 sm:grid-cols-[1fr_120px_100px_24px]">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={nft?.image ?? ''}
          alt={nft?.name ?? item.nftId}
          className="h-12 w-12 shrink-0 border border-[#4a291b] object-cover"
        />

        <div className="min-w-0">
        <Link
          to="/nft/$id"
          params={{id:item.nftId}}
          aria-label={nft?.name ?? item.nftId}
          className="block truncate text-[10px] font-semibold text-[#e9dbce] transition-colors hover:text-[#dd9550]"
        >
          {nft?.name ?? item.nftId}
        </Link>

        <div className="mt-1 text-[8px] text-[#755c4e]">
          {nft?.collection ?? 'Future Ape Collection'}
        </div>
      </div>
      </div>

      <div className="text-[10px] text-[#d68b46]">
        {eth(item.unitPrice)}
      </div>

      <div className="flex items-center border border-[#4a291b]">
        <button
          className="grid h-7 w-7 place-items-center text-[#a17b64]"
          onClick={() =>
            qty.mutate({
              id: item.nftId,
              quantity: item.quantity - 1,
            })
          }
          aria-label="Diminuir quantidade"
        >
          <Minus size={11} />
        </button>

        <div className="w-6 text-center text-[9px]">
          {item.quantity}
        </div>

        <button
          className="grid h-7 w-7 place-items-center text-[#a17b64]"
          onClick={() =>
            qty.mutate({
              id: item.nftId,
              quantity: item.quantity + 1,
            })
          }
          aria-label="Aumentar quantidade"
        >
          <Plus size={11} />
        </button>
      </div>

      <button
        className="grid h-7 w-7 place-items-center text-[#6e5447] hover:text-[#d98a42]"
        onClick={() => remove.mutate(item.nftId)}
        aria-label="Remover item"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

export function CartPage(){
  const {data,isLoading,isError,refetch}=useCart(); const qty=useCartQuantity(); const remove=useRemoveCart(); const apply=useCoupon(); const removeCoupon=useRemoveCoupon(); const nav=useNavigate(); const [coupon,setCoupon]=useState('')
  if(isLoading)return <div className="mx-auto max-w-[1180px] px-4 py-12"><Skeleton className="h-8 w-1/4"/><Skeleton className="mt-5 h-64"/></div>
  if(isError)return <div className="mx-auto max-w-[1180px] px-4 py-20"><EmptyState title="Carrinho indisponível" description="A rede simulada está temporariamente indisponível." action={<Button onClick={()=>refetch()}><RefreshCw size={14}/>Tentar novamente</Button>}/></div>
  const cart=data!.cart
  if(!cart.items.length)return <div className="mx-auto max-w-[1180px] px-4 py-20"><EmptyState title="Seu carrinho está vazio" description="Adicione um NFT do mercado para iniciar uma compra simulada." action={<Button asChild><Link to="/">Explorar NFTs <ArrowRight size={14}/></Link></Button>}/></div>
  return <div className="mx-auto max-w-[1180px] px-4 pb-12 sm:px-6">
    <div className="mt-6 border-b border-[#3b2116] pb-5"><div className="text-[9px] uppercase tracking-[.2em] text-[#966645]">Mercado / Compra</div><h1 className="mt-2 text-3xl font-semibold text-[#ede0d5]">Carrinho de NFTs</h1></div>
    <div className="mt-6 grid gap-7 lg:grid-cols-[1fr_310px]">
      <div><Card className="rounded-[2px] p-4 sm:p-5"><div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-[#3b2116] pb-3 text-[8px] uppercase tracking-[.16em] text-[#705548] sm:grid-cols-[1fr_120px_100px_24px]"><span>Item</span><span>Preço</span><span>Quantidade</span><span/></div>{cart.items.map(item=><CartLine key={item.nftId} item={item} qty={qty} remove={remove}/>)}</Card>
        <Card className="mt-4 rounded-[2px] p-4"><div className="flex items-center gap-2 text-[10px] font-semibold text-[#d2b7a4]"><Tag size={14}/>Cupom de desconto</div><div className="mt-3 flex gap-2"><input value={coupon} onChange={e=>setCoupon(e.target.value)} placeholder="Digite seu cupom" aria-label="Código do cupom" className="h-9 flex-1 border border-[#4a291b] bg-[#160c09] px-3 text-[9px] outline-none"/><Button size="sm" className="h-9 rounded-[2px] px-3 text-[9px]" onClick={()=>apply.mutate(coupon)}>Aplicar</Button>{cart.coupon&&<Button size="sm" variant="ghost" className="h-9 rounded-[2px] text-[9px]" onClick={()=>removeCoupon.mutate()}>Remover</Button>}</div>{apply.isError&&<p className="mt-2 text-[9px] text-[#d77b6b]">Cupom inválido ou expirado.</p>}{cart.coupon&&<p className="mt-2 text-[9px] text-[#d99654]">{cart.coupon.label}</p>}</Card></div>
      <Card className="h-fit rounded-[2px] p-5 lg:sticky lg:top-20"><div className="text-[11px] font-semibold text-[#e5d3c3]">Resumo do pedido</div><div className="mt-5 space-y-3 text-[10px]"><Row label="Subtotal" value={eth(data!.quote.subtotal)}/><Row label="Desconto" value={`-${eth(data!.quote.discount)}`}/><Row label="Taxa de rede" value={eth(data!.quote.networkFee)}/></div><div className="my-4 h-px bg-[#3b2116]"/><Row label="Total" value={eth(data!.quote.total)} strong/><Button className="mt-5 w-full rounded-[2px]" size="lg" disabled={!data!.quote.valid} onClick={()=>nav({to:'/checkout'})}>Continuar para pagamento <ArrowRight size={14}/></Button><div className="mt-4 flex gap-2 text-[8px] leading-4 text-[#6f5548]"><ShieldCheck size={12} className="shrink-0 text-[#bd7435]"/>Valores em ETH são strings e a cotação da API é a referência para finalizar.</div>{data!.quote.messages.length>0&&<div role="alert" className="mt-3 border border-[#68401f] bg-[#3d2516] p-3 text-[8px] leading-4 text-[#dca16a]">{data!.quote.messages.join(' ')}</div>}</Card>
    </div>
  </div>
}
function Row({label,value,strong=false}:{label:string;value:string;strong?:boolean}){return <div className={`flex items-center justify-between ${strong?'text-[13px] font-semibold text-[#f1e3d7]':'text-[#7c6152]'}`}><span>{label}</span><span className={strong?'text-[#e09a54]':'text-[#c5a694]'}>{value}</span></div>}
