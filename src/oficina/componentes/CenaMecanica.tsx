'use client';
import { useReducedMotion } from 'framer-motion';
import type { Movimento, Projeto, Transmissao } from '../modelo/tipos';
import { numero,dentes } from '../geometria';
import { useMovimento } from '../useMovimento';
export function CenaMecanica({projeto,t,ligada,observar}:{projeto:Projeto;t:Transmissao;ligada:boolean;observar:(m:Movimento)=>void}) {
 const m=useMovimento(t,projeto.carga,ligada,observar),reduzido=useReducedMotion();
 const estagio=projeto.ligacoes.find(l=>['correia','cruzada','engrenamento'].includes(l.tipo));
 const rodas=estagio?[estagio.de,estagio.para].flatMap(id=>projeto.pecas.filter(p=>p.id===id.split(':')[0])):[],ra=rodas[0]?.tipo==='engrenagem'?Math.min(52,rodas[0].valor*.65+12):26,rb=rodas[1]?.tipo==='engrenagem'?Math.min(64,rodas[1].valor*.65+12):48;
 const xa=215,xb=rodas[0]?.tipo==='engrenagem'?xa+ra+rb:365;
 const giro=reduzido?0:m.angulo*180/Math.PI;
 return <div className="of-cena-mecanica"><svg viewBox="0 0 620 385" role="img" aria-label={`Transmissão. Esteira a ${numero(m.omega*t.raio,2)} metros por segundo.`}>
 <path d="M0 284H620V385H0z" fill="var(--of-chao)"/><path d="M0 284H620 M40 310h540 M12 340h596" stroke="var(--of-grid)"/>
 <text x="28" y="31" className="of-placa-svg">VISOR DA SAÍDA</text><text x="592" y="31" textAnchor="end" className="of-placa-svg">{ligada?'EM ENSAIO':'DESLIGADA'}</text>
 <path d="M80 264v67m465-67v67" stroke="var(--of-metal-escuro)" strokeWidth="14"/><rect x="50" y="240" width="455" height="42" rx="21" fill="var(--of-metal-escuro)"/>
 <path d="M73 249h409a13 13 0 0 1 0 26H73a13 13 0 0 1 0-26Z" fill="none" stroke="var(--of-metal)" strokeWidth="5" strokeDasharray="10 12" strokeDashoffset={reduzido?0:-m.distancia*132}/>
 {[73,482].map(x=><g key={x} transform={`translate(${x} 261) rotate(${giro})`}><circle r="13" fill="var(--of-metal)"/><path d="M-9 0H9 M0-9V9" stroke="var(--of-ink)" strokeWidth="3"/></g>)}
 <svg x="56" y="188" width="440" height="54" viewBox="0 0 440 54" overflow="hidden">{m.caixas.map((c,i)=><g key={i} transform={`translate(${(reduzido?[.1,1.1,2.1][i]:c.x)*133} 4)`}><rect width="48" height="46" rx="3" fill="var(--of-caixa)" stroke="var(--of-ink)" strokeWidth="2"/><path d="M24 0v46 M3 7h42" stroke="var(--of-caixa-fita)" strokeWidth="5"/><path d="m8 34 4-7 4 7m-4-7v14" stroke="var(--of-ink)" fill="none" strokeWidth="2"/></g>)}</svg>
 <rect x="67" y="79" width="91" height="66" rx="10" fill="var(--of-azul)" stroke="var(--of-ink)" strokeWidth="2"/><path d="M80 87v49m14-49v49m14-49v49m14-49v49" stroke="var(--of-metal)" strokeWidth="3"/><text x="112" y="165" textAnchor="middle" className="of-etiqueta-svg">{projeto.pecas.find(p=>p.tipo==='motor')?.tag??'SEM MOTOR'}</text>
 <path d={`M158 113H${xa} M${xb} 113h82v126`} stroke="var(--of-metal-escuro)" strokeWidth="9" fill="none"/>
 {rodas.length===2&&rodas[0].tipo==='polia'&&<path d={estagio?.tipo==='cruzada'?`M${xa} ${113-ra}L${xb} ${113+rb}A${rb} ${rb} 0 0 0 ${xb} ${113-rb}L${xa} ${113+ra}A${ra} ${ra} 0 0 1 ${xa} ${113-ra}`:`M${xa} ${113-ra}L${xb} ${113-rb}A${rb} ${rb} 0 0 1 ${xb} ${113+rb}L${xa} ${113+ra}A${ra} ${ra} 0 0 1 ${xa} ${113-ra}`} fill="none" stroke="var(--of-correia)" strokeWidth={t.escorrega?3:6} strokeDasharray={t.escorrega?'8 5':undefined}/>}
 {rodas.map((p,i)=>{const r=i?rb:ra;const ang=reduzido?0:!i&&(t.escorrega||!t.conectada)?m.anguloEntrada*180/Math.PI*(t.razoes[p.id]??1):t.razao?giro*(t.razoes[p.id]??0)/t.razao:0;return <g key={p.id} transform={`translate(${i?xb:xa} 113)`}><g transform={`rotate(${ang})`}>{p.tipo==='engrenagem'?<path d={dentes(p.valor,r)} fill="var(--of-acento)" stroke="var(--of-ink)" strokeWidth="2"/>:<circle r={r} fill="var(--of-metal)" stroke="var(--of-ink)" strokeWidth="3"/>}<circle r={r*.65} fill="var(--of-chao)"/><path d={`M0 ${-r*.8}v${r*1.6} M${-r*.8} 0h${r*1.6}`} stroke="var(--of-metal-escuro)" strokeWidth="7"/><circle r="9" fill="var(--of-ink)"/></g><text y={-r-13} textAnchor="middle" className="of-etiqueta-svg">{p.tag} · {p.valor}{p.tipo==='engrenagem'?' z':' mm'}</text></g>;})}
 {t.escorrega&&ligada&&<text x="300" y="185" textAnchor="middle" fill="var(--of-falha)" fontSize="13" fontWeight="800">PATINAGEM</text>}
 <text x="78" y="361" className="of-placa-svg">{m.omega<-.01?'← RETORNO':m.omega>.01?'AVANÇO →':'SEM DESLOCAMENTO'}</text><text x="530" y="361" textAnchor="end" className="of-placa-svg">CARGA {projeto.carga} kg</text>
 </svg><div className="of-telemetria"><div><span>VELOCIDADE REAL</span><strong>{numero(m.omega*t.raio,2)} <small>m/s</small></strong></div><div><span>SAÍDA REAL</span><strong>{numero(m.omega*30/Math.PI,0)} <small>rpm</small></strong></div><div><span>TRANSPORTADOS</span><strong>{m.entregas} <small>volumes</small></strong></div></div></div>;
}
