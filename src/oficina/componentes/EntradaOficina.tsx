import { motion } from 'framer-motion';
import type { Area } from '../modelo/tipos';
import { ArteOficina } from './ArteOficina';
import { IconeOficina } from './IconeOficina';
export function EntradaOficina({escolher}:{escolher:(area:Area)=>void}) { return <main className="of-entrada">
 <div className="of-intro"><p className="of-eyebrow">APRENDA FAZENDO. DE VERDADE.</p><h1>O mundo funciona.<br/><em>Descubra por quê.</em></h1><p>Uma oficina nas suas mãos. Investigue falhas, dê vida a máquinas e construa algo que só existe porque você criou.</p></div>
 <div className="of-portas">{(['eletrica','mecanica'] as Area[]).map((area,i)=><motion.button key={area} className={`of-porta of-${area}`} onClick={()=>escolher(area)} whileHover={{y:-5}} whileTap={{scale:.985}}><span className="of-numero">0{i+1} / ESCOLHA SUA BANCADA</span><ArteOficina area={area}/><span className="of-porta-titulo"><strong>{area==='eletrica'?'Elétrica':'Mecânica'}</strong><IconeOficina nome="seta" tamanho={30}/></span><span className="of-porta-texto">{area==='eletrica'?'Siga a energia. Encontre a falha. Feche o circuito.':'Transforme movimento. Sinta a carga. Encontre o ritmo.'}</span><span className="of-porta-etiqueta">{area==='eletrica'?'CIRCUITOS · COMANDOS · DIAGNÓSTICO':'ENGRENAGENS · POLIAS · TRANSMISSÕES'}</span></motion.button>)}</div>
 <div className="of-premissas"><span><IconeOficina nome="olho"/>Investigue uma máquina</span><span><IconeOficina nome="mais"/>Crie seu próprio projeto</span><span><IconeOficina nome="ligar"/>Veja tudo reagir</span></div>
 <p className="of-nota">Comece por qualquer área. Sem cadastro. Seu trabalho fica salvo neste navegador.</p>
 </main>; }
