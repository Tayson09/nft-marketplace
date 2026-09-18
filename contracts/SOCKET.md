# Socket.IO events

Transport: Socket.IO client using the WebSocket transport. In the browser mock, `@mswjs/socket.io-binding` is used to bridge Mock Service Worker WebSocket interception with Socket.IO's event model.

### `nft.updated`
```json
{"resource":"nft","id":"nft-1","version":2,"price":"1.79","available":2}
```

### `order.updated`
```json
{"resource":"order","id":"ord-123","version":2,"status":"confirmed"}
```

The application ignores an event when its version is not higher than the last observed version for that resource. Reconnection triggers REST invalidation for active resources.
