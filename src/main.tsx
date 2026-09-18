import React from 'react'
import ReactDOM from 'react-dom/client'
import {QueryClient,QueryClientProvider} from '@tanstack/react-query'
import {RouterProvider} from '@tanstack/react-router'
import {router} from './routes/router'
import {AuthProvider} from './auth/context'
import './index.css'
import {connectRealtime} from './realtime/socketClient'

const queryClient=new QueryClient({defaultOptions:{queries:{retry:1,refetchOnWindowFocus:false},mutations:{retry:0}}})

async function bootstrap(){
  if(import.meta.env.VITE_ENABLE_MOCKS!=='false'){
    const {worker}=await import('./mocks/browser')
    await worker.start({onUnhandledRequest:'bypass'})
  }
  connectRealtime(queryClient)
  ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><QueryClientProvider client={queryClient}><AuthProvider><RouterProvider router={router}/></AuthProvider></QueryClientProvider></React.StrictMode>)
}
bootstrap()
