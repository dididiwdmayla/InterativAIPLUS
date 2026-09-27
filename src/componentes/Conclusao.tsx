import { FASES, obterFase } from '@/conteudo/campanha';
import type { EstadoJogo, AcaoJogo } from '@/motor/jogo';
import { Icone } from './Icone';
import { Celebracao } from './Celebracao';
export function Conclusao({ estado, enviar }: { estado: EstadoJogo; enviar: (a: AcaoJogo) => void }) {
  const fase = obterFase(estado.faseId), proxima = FASES[FASES.indexOf(fase) + 1];
  const completa = FASES.every(f => estado.fasesConcluidas.includes(f.id));
  return <section className="conclusao" aria-label="Fase concluída"><Celebracao/><div><span className="sobretitulo">{completa ? 'SELO CONQUISTADO · LEITOR DE PAINÉIS' : 'ILHA ELÉTRICA · MAIS UMA DESCOBERTA'}</span><h2>{fase.conquista}</h2><div className="estrelas estrelas-conclusao" aria-label={`${estado.estrelas} estrelas conquistadas`}>{[1, 2, 3].map(n => <span key={n} className={n <= estado.estrelas ? 'acesa' : ''} style={{ animationDelay: `${n * .12}s` }}><Icone nome="estrela" tamanho={38}/></span>)}</div><p>{fase.habilidade}. Agora isso faz parte do seu repertório.</p>{proxima && <button className="botao primario" onClick={() => enviar({ tipo: 'abrir-fase', id: proxima.id })}>Próxima missão<Icone nome="seta" tamanho={18}/></button>}{completa && <p className="selo-leitor"><Icone nome="raio"/>Montou. Investigou. Recuperou.</p>}</div><div className="missao-campo"><strong>Leve a descoberta com você</strong><p>{fase.missaoDeCampo}</p><label><input type="checkbox" checked={estado.missao} onChange={e => enviar({ tipo: 'missao', valor: e.target.checked })}/>Identifiquei em uma foto ou diagrama real</label></div></section>;
}
