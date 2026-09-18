import {api} from '../api/client'
export type GuestCartItem={nftId:string;quantity:number}
const KEY='nova.guest.cart'
export function getGuestCart():GuestCartItem[]{try{return JSON.parse(localStorage.getItem(KEY)??'[]') as GuestCartItem[]}catch{return[]}}
export function addGuestCartItem(nftId:string,quantity:number){const current=getGuestCart();const existing=current.find(i=>i.nftId===nftId);if(existing)existing.quantity+=quantity;else current.push({nftId,quantity});localStorage.setItem(KEY,JSON.stringify(current))}
export function clearGuestCart(){localStorage.removeItem(KEY)}
export async function mergeGuestCart(){const items=getGuestCart();if(!items.length)return;try{for(const item of items)await api.post('/cart/items',item);clearGuestCart()}catch{/* Keep guest items so a later login can retry the merge. */}}
