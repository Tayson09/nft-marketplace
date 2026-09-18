import {Link} from '@tanstack/react-router'
import {Button,Card} from '../components/ui'
export function NotFoundPage(){return <div className="grid min-h-[70vh] place-items-center px-4"><Card className="max-w-lg p-10 text-center"><div className="text-5xl font-black">404</div><h1 className="mt-3 text-xl font-semibold">Page not found</h1><p className="mt-2 text-sm text-zinc-500">That route does not exist in this challenge.</p><Button asChild className="mt-6"><Link to="/">Back home</Link></Button></Card></div>}
