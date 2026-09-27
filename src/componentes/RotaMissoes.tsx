import { FASES, faseLiberada } from '@/conteudo/campanha';
import type { EstadoJogo, AcaoJogo } from '@/motor/jogo';
import { Icone } from './Icone';
export function RotaMissoes({ estado, enviar }: { estado: EstadoJogo; enviar: (a: AcaoJogo) => void }) {
  return <nav className="rota-missoes" aria-label="Rota da fornada"><div className="rota-titulo"><strong>Rota da fornada</strong><span>{estado.fasesConcluidas.length} de {FASES.length} missões concluídas</span></div><div className="trilha-missoes"><svg viewBox="0 0 900 95" preserveAspectRatio="none" aria-hidden="true"><path d="M150 50C270 0 300 95 450 50S630 5 750 50" fill="none" stroke="var(--cor-rota)" strokeWidth="5" strokeDasharray="7 9"/></svg>{FASES.map((f, i) => {
    const liberada = faseLiberada(f.id, estado.fasesConcluidas), concluida = estado.fasesConcluidas.includes(f.id);
    return <button key={f.id} disabled={!liberada} aria-current={estado.faseId === f.id ? 'step' : undefined} aria-label={`Abrir missão ${i + 1}: ${f.titulo}${liberada ? '' : ', bloqueada'}`} onClick={() => enviar({ tipo: 'abrir-fase', id: f.id })}><span className={`ilha-missao ${concluida ? 'concluida' : ''}`}>{!liberada ? <Icone nome="cadeado" tamanho={21}/> : concluida ? <Icone nome="estrela" tamanho={24}/> : <b>{i + 1}</b>}</span><strong>{['Monte', 'Investigue', 'Recupere'][i]}</strong><small>{concluida ? `${estado.estrelasPorFase[f.id] ?? 1} estrelas` : estado.faseId === f.id ? 'Você está aqui' : liberada ? 'Bancada disponível' : 'Após a anterior'}</small></button>;
  })}</div></nav>;
}
