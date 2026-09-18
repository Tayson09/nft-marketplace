import axios from 'axios'
import {getScenario} from '../mocks/scenarios'
export const api=axios.create({baseURL:import.meta.env.VITE_API_URL??'/api',timeout:7000,headers:{'Content-Type':'application/json'}})
api.interceptors.request.use((config)=>{const token=localStorage.getItem('nova.token');if(token)config.headers.Authorization=`Bearer ${token}`;const scenario=getScenario();if(scenario!=='normal')config.headers['x-mock-scenario']=scenario;return config})
api.interceptors.response.use((r)=>r,(e)=>{if(e?.response?.status===401){window.dispatchEvent(new CustomEvent('nova:session-expired'))}return Promise.reject(e)})
