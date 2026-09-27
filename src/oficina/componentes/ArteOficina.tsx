import type { Area } from '../modelo/tipos';
import { dentes } from '../geometria';
export function ArteOficina({area}:{area:Area}) { return <svg className="of-arte" viewBox="0 0 460 270" aria-hidden="true">
 <ellipse cx="237" cy="234" rx="181" ry="20" fill="var(--of-sombra)"/>
 {area==='eletrica'?<>
 <path d="m92 38 28-16h232l22 16v180l-23 18H113l-21-18z" fill="var(--of-metal-escuro)"/>
 <rect x="91" y="38" width="260" height="197" rx="12" fill="var(--of-metal)" stroke="var(--of-ink)" strokeWidth="2"/>
 <rect x="108" y="54" width="226" height="150" rx="5" fill="var(--of-papel)"/>
 <path d="M123 81h86v32h80v65H162v-42h-39z" stroke="var(--of-energia)" strokeWidth="5" fill="none"/>
 <path d="M138 175v-65h68" stroke="var(--of-azul)" strokeWidth="4" fill="none"/>
 <rect x="169" y="80" width="75" height="83" rx="6" fill="var(--of-ink)"/><rect x="188" y="98" width="37" height="40" rx="3" fill="var(--of-acento)"/><text x="207" y="125" textAnchor="middle" fill="var(--of-ink)" fontSize="19" fontWeight="800">K1</text>
 <path d="M185 69v18m22-18v18m22-18v18m-44 70v18m22-18v18m22-18v18" stroke="var(--of-metal-escuro)" strokeWidth="6"/>
 <circle cx="125" cy="218" r="7" fill="var(--of-sucesso)"/><circle cx="152" cy="218" r="7" fill="var(--of-falha)"/><text x="245" y="222" fill="var(--of-papel)" fontSize="10" letterSpacing="2">24 VCC</text>
 <g transform="translate(310 140) rotate(12)"><rect width="86" height="115" rx="13" fill="var(--of-acento)" stroke="var(--of-ink)" strokeWidth="3"/><rect x="12" y="14" width="62" height="36" rx="4" fill="var(--of-ink)"/><text x="44" y="39" textAnchor="middle" fill="var(--of-papel)" fontSize="19" fontFamily="var(--fonte-codigo)">24.0</text><circle cx="43" cy="78" r="19" fill="var(--of-ink)"/><path d="m43 78 10-10" stroke="var(--of-papel)" strokeWidth="4"/></g>
 </>:<>
 <path d="m74 219 43-16h244l34 16-24 22H94z" fill="var(--of-metal-escuro)"/><rect x="95" y="213" width="280" height="17" rx="4" fill="var(--of-metal)"/>
 <path d="M174 129v84h24v-84M288 142v71h24v-71" fill="var(--of-metal)" stroke="var(--of-ink)" strokeWidth="2"/>
 <g transform="translate(186 122)"><g className="of-rotacao-lenta"><path d={dentes(20,68)} fill="var(--of-acento)" stroke="var(--of-ink)" strokeWidth="2"/><circle r="42" fill="var(--of-papel)"/><circle r="17" fill="var(--of-ink)"/><path d="M0-20v-23 M0 20v23 M20 0h23 M-20 0h-23" stroke="var(--of-acento)" strokeWidth="12"/></g></g>
 <g transform="translate(295 125)"><g className="of-rotacao-inversa"><path d={dentes(12,39)} fill="var(--of-azul)" stroke="var(--of-ink)" strokeWidth="2"/><circle r="24" fill="var(--of-metal)"/><circle r="11" fill="var(--of-ink)"/><path d="M0-11v-14" stroke="var(--of-papel)" strokeWidth="5"/></g></g>
 <path d="M107 74v110M101 74h12m-12 110h12 M267 50h62m-62-6v12m62-12v12" stroke="var(--of-muted)" fill="none"/><text x="90" y="133" transform="rotate(-90 90 133)" fill="var(--of-muted)" fontSize="10">MOVIMENTO</text>
 <rect x="309" y="172" width="94" height="50" rx="8" fill="var(--of-ink)"/><path d="M323 181v32m12-32v32m12-32v32m12-32v32" stroke="var(--of-metal)" strokeWidth="3"/><circle cx="391" cy="197" r="16" fill="var(--of-acento)"/>
 </>}
 </svg>; }
