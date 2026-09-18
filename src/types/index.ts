export type Network='Ethereum'|'Polygon'
export type NFT={id:string;name:string;collection:string;description:string;image:string;gallery:string[];price:string;floorPrice:string;currency:'ETH';available:number;edition:number;creator:string;category:string;tags:string[];version:number;featured?:boolean}
export type User={id:string;email:string;name:string;avatar:string;passwordHash:string;createdAt:string}
export type Wallet={id:string;name:string;address:string;network:Network;isPrimary:boolean;connected:boolean}
export type CartItem={
  nftId:string
  name:string
  collection:string
  image:string
  quantity:number
  unitPrice:string
  version:number
}
export type Cart={items:CartItem[];coupon?:{code:string;discount:string;label:string};updatedAt:string}
export type Quote={subtotal:string;discount:string;networkFee:string;total:string;currency:'ETH';expiresAt:string;version:string;valid:boolean;messages:string[]}
export type OrderStatus='pending'|'confirmed'|'rejected'
export type OrderItem={nftId:string;name:string;image:string;quantity:number;unitPrice:string;lineTotal:string}
export type Order={id:string;idempotencyKey:string;userId:string;status:OrderStatus;transactionId:string;items:OrderItem[];subtotal:string;discount:string;networkFee:string;total:string;currency:'ETH';createdAt:string;version:number;failureReason?:string}
export type ApiError={code:string;message:string;field?:string}
