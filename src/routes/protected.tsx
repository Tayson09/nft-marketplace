import {Navigate,useLocation} from '@tanstack/react-router'
import {useAuth} from '../auth/context'
export function Protected({children}:{children:React.ReactNode}){const {user,loading}=useAuth();const location=useLocation();if(loading)return <div className="mx-auto max-w-7xl px-4 py-20 text-center text-zinc-500">Carregando sessão…</div>;if(!user)return <Navigate to="/login" search={{redirect:location.href}}/>;return <>{children}</>}
