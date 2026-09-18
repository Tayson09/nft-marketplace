# REST contracts

Base URL: `/api`

### Session & auth
- `POST /auth/register` `{name,email,password}` -> `{user,token}`
- `POST /auth/login` `{email,password}` -> `{user,token}`
- `GET /session` -> `{user}`
- `POST /auth/logout` -> `{ok}`

### NFTs
- `GET /nfts?search&category&sort&page&size` -> `{items,page,size,total,pages}`
- `GET /nfts/:id` -> `{nft}`

### Favorites
- `GET /favorites` -> `{ids:string[]}`
- `POST /favorites/:id` -> `{ids}`
- `DELETE /favorites/:id` -> `{ids}`

### Cart
- `GET /cart` -> `{cart,quote}`
- `POST /cart/items` `{nftId,quantity}` -> `{cart,quote}`
- `PATCH /cart/items/:id` `{quantity}` -> `{cart,quote}`
- `DELETE /cart/items/:id` -> `{cart,quote}`
- `POST /cart/coupon` `{code}` -> `{cart,quote,valid}`
- `DELETE /cart/coupon` -> `{cart,quote}`
- `POST /quote` `{coupon?}` -> `{quote}`

### Orders
- `POST /orders` header `Idempotency-Key`, body `{quoteVersion}` -> `{order}`
- `GET /orders` -> `{orders}`
- `GET /orders/:id` -> `{order}`
- `POST /orders/:id/decision` `{accept}` -> `{order}`

### Account
- `GET /profile` -> `{user}`
- `PATCH /profile` `{name?,avatar?}` -> `{user}`
- `PATCH /profile/password` `{currentPassword,newPassword}` -> `{ok}`
- `GET /wallets` -> `{wallets}`
- `POST /wallets` wallet -> `{wallets}`
- `PATCH /wallets/:id` wallet -> `{wallets}`

Errors use `{code,message,field?}` with 401, 403/404, 409, 422 and transient 5xx scenarios represented in fixtures/handlers.
