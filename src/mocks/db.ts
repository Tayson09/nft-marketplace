import {nfts,users,wallets,orders} from './fixtures'
import type {Cart,CartItem,Quote,Order,User,Wallet,NFT} from '../types'

type State={
  cart:Record<string,Cart>
  favorites:Record<string,string[]>
  users:User[]
  wallets:Record<string,Wallet[]>
  orders:Record<string,Order[]>
  nfts:NFT[]
}

const CART_STORAGE_KEY='nova.mock.carts'

function createEmptyCart():Cart{
  return{
    items:[],
    updatedAt:new Date().toISOString(),
  }
}

function loadPersistedCarts():Record<string,Cart>{
  if(typeof localStorage==='undefined'){
    return{}
  }

  try{
    const raw=localStorage.getItem(CART_STORAGE_KEY)

    if(!raw){
      return{}
    }

    const parsed=JSON.parse(raw) as Record<string,Cart>

    if(!parsed||typeof parsed!=='object'){
      return{}
    }

    return parsed
  }catch{
    return{}
  }
}

function persistCarts(carts:Record<string,Cart>){
  if(typeof localStorage==='undefined'){
    return
  }

  try{
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(carts),
    )
  }catch{
    return
  }
}

const initialCarts={
  u1:createEmptyCart(),
  u2:createEmptyCart(),
  ...loadPersistedCarts(),
}

const state:State={
  cart:initialCarts,
  favorites:{
    u1:['nft-2'],
    u2:[],
  },
  users:[...users],
  wallets:{...wallets},
  orders:{...orders},
  nfts:[...nfts.map(n=>({...n})),],
}

export const getUser=(id:string)=>
  state.users.find(
    u=>u.id===id,
  )

export const getUserByEmail=(email:string)=>
  state.users.find(
    u=>
      u.email.toLowerCase()===
      email.toLowerCase(),
  )

export const createUser=(user:User)=>{
  state.users.push(user)

  state.cart[user.id]=createEmptyCart()

  state.favorites[user.id]=[]

  state.wallets[user.id]=[]

  state.orders[user.id]=[]

  persistCarts(state.cart)

  return user
}

export const getCart=(userId:string)=>
  state.cart[userId]??(
    state.cart[userId]=createEmptyCart()
  )

export const getFavorites=(userId:string)=>
  state.favorites[userId]??(
    state.favorites[userId]=[]
  )

export const getWallets=(userId:string)=>
  state.wallets[userId]??(
    state.wallets[userId]=[]
  )

export const getOrders=(userId:string)=>
  state.orders[userId]??(
    state.orders[userId]=[]
  )

export const listNfts=()=>
  state.nfts

export const getNft=(id:string)=>
  state.nfts.find(
    n=>n.id===id,
  )

export function addCart(
  userId:string,
  item:CartItem,
){
  const cart=getCart(userId)

  const existing=cart.items.find(
    i=>i.nftId===item.nftId,
  )

  if(existing){
    existing.quantity=Math.min(
      existing.quantity+item.quantity,
      getNft(item.nftId)?.available??1,
    )

    existing.unitPrice=item.unitPrice
    existing.version=item.version
  }else{
    cart.items.push({
      ...item,
    })
  }

  cart.updatedAt=
    new Date().toISOString()

  persistCarts(state.cart)

  return cart
}

export function updateCartItem(
  userId:string,
  nftId:string,
  quantity:number,
){
  const cart=getCart(userId)

  const item=cart.items.find(
    i=>i.nftId===nftId,
  )

  if(!item){
    throw new Error(
      'item_not_found',
    )
  }

  const nft=getNft(nftId)

  item.quantity=Math.max(
    1,
    Math.min(
      quantity,
      nft?.available??1,
    ),
  )

  item.version=
    nft?.version??item.version

  item.unitPrice=
    nft?.price??item.unitPrice

  cart.updatedAt=
    new Date().toISOString()

  persistCarts(state.cart)

  return cart
}

export function removeCart(
  userId:string,
  nftId:string,
){
  const cart=getCart(userId)

  cart.items=
    cart.items.filter(
      i=>i.nftId!==nftId,
    )

  cart.updatedAt=
    new Date().toISOString()

  persistCarts(state.cart)

  return cart
}

export function setCoupon(
  userId:string,
  coupon:Cart['coupon'],
){
  const cart=getCart(userId)

  cart.coupon=coupon

  cart.updatedAt=
    new Date().toISOString()

  persistCarts(state.cart)

  return cart
}

export function quote(
  userId:string,
  coupon?:string,
):Quote{
  const cart=getCart(userId)

  let subtotal=0

  const messages:string[]=[]

  for(const item of cart.items){
    const nft=getNft(item.nftId)

    if(!nft){
      messages.push(
        'Um item não está mais disponível.',
      )

      continue
    }

    subtotal+=
      Number(nft.price)*
      item.quantity

    if(
      item.version!==nft.version
    ){
      messages.push(
        `${nft.name} teve atualização de preço ou disponibilidade.`,
      )
    }

    if(
      item.quantity>nft.available
    ){
      messages.push(
        `${nft.name} não possui unidades suficientes.`,
      )
    }
  }

  let discount=0

  if(coupon==='NOVA10'){
    discount=
      Number(
        (
          subtotal*0.1
        ).toFixed(4),
      )
  }else if(coupon){
    messages.push(
      'Cupom inválido ou expirado.',
    )
  }

  const networkFee=
    Number(
      (
        Math.max(
          subtotal-discount,
          0,
        )*
          0.025+
        0.015
      ).toFixed(4),
    )

  const total=
    Number(
      (
        subtotal-
        discount+
        networkFee
      ).toFixed(4),
    )

  return{
    subtotal:subtotal.toFixed(4),
    discount:discount.toFixed(4),
    networkFee:networkFee.toFixed(4),
    total:total.toFixed(4),
    currency:'ETH',
    expiresAt:
      new Date(
        Date.now()+60_000,
      ).toISOString(),
    version:
      cart.items
        .map(
          i=>
            `${i.nftId}:${
              getNft(
                i.nftId,
              )?.version??0
            }`,
        )
        .join('|')+
      `|${coupon??''}`,
    valid:
      messages.length===0&&
      cart.items.length>0,
    messages,
  }
}

export function updateNftPrice(
  id:string,
  price:string,
  available:number,
){
  const nft=getNft(id)

  if(!nft){
    return
  }

  nft.price=price
  nft.available=available
  nft.version+=1

  return nft
}

export function setWallet(
  userId:string,
  wallet:Wallet,
){
  const list=getWallets(userId)

  const idx=list.findIndex(
    w=>w.id===wallet.id,
  )

  if(idx>=0){
    list[idx]=wallet
  }else{
    list.push(wallet)
  }

  if(wallet.isPrimary){
    list.forEach(
      w=>{
        if(w.id!==wallet.id){
          w.isPrimary=false
        }
      },
    )
  }

  return list
}

export function createOrder(
  userId:string,
  key:string,
):Order|null{
  const existing=
    getOrders(userId).find(
      o=>
        o.idempotencyKey===key,
    )

  if(existing){
    return existing
  }

  const q=
    quote(
      userId,
      getCart(userId).coupon?.code,
    )

  if(!q.valid){
    throw new Error(
      q.messages.join(' ')||
      'quote_invalid',
    )
  }

  const cart=getCart(userId)

  const items=
    cart.items.map(
      i=>{
        const nft=
          getNft(i.nftId)!

        return{
          nftId:nft.id,
          name:nft.name,
          image:nft.image,
          quantity:i.quantity,
          unitPrice:nft.price,
          lineTotal:
            (
              Number(nft.price)*
              i.quantity
            ).toFixed(4),
        }
      },
    )

  const order:Order={
    id:`ord-${Date.now()}`,
    idempotencyKey:key,
    userId,
    status:'pending',
    transactionId:
      `0xmock${
        Math.random()
          .toString(16)
          .slice(2,18)
      }`,
    items,
    subtotal:q.subtotal,
    discount:q.discount,
    networkFee:q.networkFee,
    total:q.total,
    currency:'ETH',
    createdAt:
      new Date().toISOString(),
    version:1,
  }

  getOrders(userId).unshift(
    order,
  )

  return order
}

export function confirmOrder(
  userId:string,
  id:string,
  accept:boolean,
){
  const order=
    getOrders(userId).find(
      o=>o.id===id,
    )

  if(!order){
    return
  }

  order.status=
    accept
      ?'confirmed'
      :'rejected'

  order.version+=1

  if(!accept){
    order.failureReason=
      'A conexão da carteira foi recusada no cenário simulado.'
  }

  if(accept){
    const cart=getCart(userId)

    for(
      const item of order.items
    ){
      const nft=
        getNft(item.nftId)

      if(nft){
        nft.available=
          Math.max(
            0,
            nft.available-
              item.quantity,
          )
      }
    }

    cart.items=
      cart.items.filter(
        ci=>
          !order.items.some(
            oi=>
              oi.nftId===ci.nftId,
          ),
      )

    cart.updatedAt=
      new Date().toISOString()

    persistCarts(state.cart)
  }

  return order
}

export const resetScenario=()=>{
  if(
    typeof localStorage!==
    'undefined'
  ){
    localStorage.removeItem(
      CART_STORAGE_KEY,
    )
  }

  state.cart={
    u1:createEmptyCart(),
    u2:createEmptyCart(),
  }

  state.favorites={
    u1:['nft-2'],
    u2:[],
  }

  state.nfts=[
    ...nfts.map(
      n=>({...n}),
    ),
  ]

  state.wallets={
    ...wallets,
  }

  state.orders={
    u1:[],
    u2:[],
  }

  persistCarts(state.cart)
}