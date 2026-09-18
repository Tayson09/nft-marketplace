export function eth(value:string|number){return `${Number(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:4})} ETH`}
export function money(value:number){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value)}
export function shortenAddress(value:string){return `${value.slice(0,6)}…${value.slice(-4)}`}
