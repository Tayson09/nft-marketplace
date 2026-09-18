export type MockScenario='normal'|'slow'|'offline'
const KEY='nova.mock.scenario'
export function getScenario():MockScenario{const value=localStorage.getItem(KEY);return value==='slow'||value==='offline'?value:'normal'}
export function setScenario(value:MockScenario){localStorage.setItem(KEY,value);window.dispatchEvent(new CustomEvent('nova:scenario',{detail:value}))}
export function resetScenarioPreference(){localStorage.removeItem(KEY)}
