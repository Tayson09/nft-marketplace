/* eslint-disable react-refresh/only-export-components */
import {createContext,useContext,useEffect,useMemo,useState,type PropsWithChildren} from 'react'
import {useQueryClient} from '@tanstack/react-query'
import {api} from '../api/client'
import {mergeGuestCart} from '../cart/guest'
import {useSession} from '../api/hooks'
import type {User} from '../types'

type AuthContextValue={user:User|null;loading:boolean;login:(email:string,password:string)=>Promise<void>;register:(name:string,email:string,password:string)=>Promise<void>;logout:()=>Promise<void>}
const AuthContext=createContext<AuthContextValue|null>(null)
export function AuthProvider({children}:PropsWithChildren){const qc=useQueryClient();const [user,setUser]=useState<User|null>(null);const session=useSession();useEffect(()=>{if(session.data)setUser(session.data);else if(session.isError){localStorage.removeItem('nova.token');setUser(null)}},[session.data,session.isError]);useEffect(()=>{const fn=()=>{localStorage.removeItem('nova.token');setUser(null);qc.clear()};window.addEventListener('nova:session-expired',fn);return()=>window.removeEventListener('nova:session-expired',fn)},[qc]);
 const value=useMemo<AuthContextValue>(()=>({user,loading:session.isLoading||(Boolean(localStorage.getItem('nova.token'))&&!user&&!session.isError),login:async(email,password)=>{const r=await api.post('/auth/login',{email,password});localStorage.setItem('nova.token',r.data.token);setUser(r.data.user);await mergeGuestCart();await qc.invalidateQueries();},register:async(name,email,password)=>{const r=await api.post('/auth/register',{name,email,password});localStorage.setItem('nova.token',r.data.token);setUser(r.data.user);await mergeGuestCart();await qc.invalidateQueries();},logout:async()=>{try{await api.post('/auth/logout')}finally{localStorage.removeItem('nova.token');setUser(null);qc.clear()} }}),[user,session.isError,session.isLoading,qc]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used inside AuthProvider');return ctx}
