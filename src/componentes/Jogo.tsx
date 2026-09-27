'use client';
import { useState } from 'react';
import { useJogo } from '@/motor/useJogo';
import { FASES, obterFase } from '@/conteudo/campanha';
import type { AcaoJogo } from '@/motor/jogo';
import type { Fala } from '@/motor/tipos';
import { useSons } from '@/som/useSons';
import { BarraSuperior } from './BarraSuperior';
import { PainelEletrico } from './PainelEletrico';
import { Bancada } from './Bancada';
import { ListaObjetivos } from './ListaObjetivos';
import { GuiaFase } from './GuiaFase';
import { Conclusao } from './Conclusao';
import { Confirmacao } from './Confirmacao';
import { CampoTutor } from './CampoTutor';
import { PainelNotacao } from './PainelNotacao';
import { RotaMissoes } from './RotaMissoes';
import { Testador } from './Testador';
export function Jogo() {
  const { estado, enviar } = useJogo(); useSons(estado);
  const [falaTutor, setFalaTutor] = useState<Fala | null>(null), [destacado, setDestacado] = useState<string | null>(null), [reset, setReset] = useState(false);
  const [escolhaArea, setEscolhaArea] = useState<{ contexto: string; area: 'painel' | 'bancada' } | null>(null);
  const fase = obterFase(estado.faseId), objetivo = fase.objetivos[estado.objetivo], contexto = `${fase.id}:${estado.objetivo}`;
  const aba = escolhaArea?.contexto === contexto ? escolhaArea.area : objetivo.area ?? 'painel';
  function acao(a: AcaoJogo) {
    setFalaTutor(null); enviar(a);
    if (a.tipo === 'abrir-fase' || a.tipo === 'recomecar') { setEscolhaArea(null); setDestacado(null); document.querySelector('.cabecalho-fase')?.scrollIntoView({ block: 'start' }); }
  }
  const destaque = estado.degrau === 3 && estado.momento === 'objetivo' ? objetivo.ajudas.linha.alvo : undefined;
  if (!estado.carregado) return <main className="carregando" aria-live="polite">Preparando sua bancada...</main>;
  return <><BarraSuperior faseNumero={FASES.indexOf(fase) + 1} tema={estado.tema} mudarTema={tema => acao({ tipo: 'tema', tema })} som={estado.som} mudarSom={() => acao({ tipo: 'som' })} estrelas={estado.estrelas} segredo={estado.segredo}/>
    <main className="jogo jogo-campanha"><RotaMissoes estado={estado} enviar={acao}/><div className="cabecalho-fase"><div><span className="sobretitulo">PLANTÃO NA PADARIA · MISSÃO {FASES.indexOf(fase) + 1} DE {FASES.length}</span><h1>{fase.titulo}<span>.</span></h1><p>{fase.resumo}</p></div></div>
      {estado.momento === 'conclusao' && <Conclusao estado={estado} enviar={acao}/>}
      <GuiaFase key={fase.id} estado={estado} enviar={acao} falaTutor={falaTutor}/><ListaObjetivos estado={estado}/>
      <div className="abas-moveis" role="tablist" aria-label="Área de trabalho"><button role="tab" aria-selected={aba === 'painel'} aria-controls="area-painel" onClick={() => setEscolhaArea({ contexto, area: 'painel' })}>Painel</button><button role="tab" aria-selected={aba === 'bancada'} aria-controls="area-bancada" onClick={() => setEscolhaArea({ contexto, area: 'bancada' })}>Bancada{estado.editor.simulacao.motor ? ' · ligada' : ''}</button></div>
      <div className={`area-jogo aba-${aba}`}><div id="area-painel" className="coluna-painel"><PainelEletrico key={fase.id} editor={estado.editor} enviar={a => acao({ tipo: 'editor', acao: a })} hover={setDestacado} editavel={estado.objetivo >= fase.editarDesde && estado.momento !== 'introducao'} destaque={destaque}/></div><div id="area-bancada" className={`coluna-bancada ${destaque === 'bancada-s1' ? 'alvo-ajuda' : ''}`}><Bancada circuito={estado.editor.circuito} estado={estado.editor.simulacao} destacado={destacado} atuar={a => acao({ tipo: 'editor', acao: { tipo: 'atuar', acao: a } })}/></div></div>
      <Testador circuito={estado.editor.circuito} estado={estado.editor.simulacao} bloqueado={estado.momento === 'introducao'} atuar={a => acao({ tipo: 'editor', acao: { tipo: 'atuar', acao: a } })}/>
      <details className="conversa-opcional"><summary>Quer conversar com o computadorzinho?</summary><CampoTutor key={`${fase.id}-${estado.momento}-${estado.objetivo}`} estado={estado} falar={setFalaTutor} descobrir={() => { enviar({ tipo: 'segredo' }); setFalaTutor({ texto: 'Você me achou por dentro! O tema Segredo é seu. Essa curiosidade vai te levar longe.', expressao: 'comemorando' }); }}/></details>
      {estado.momento === 'conclusao' && <PainelNotacao circuito={estado.editor.circuito}/>}
      <div className="rodape-jogo"><span>{estado.salvamentoFalhou ? 'Seu navegador não permitiu salvar. Você pode continuar nesta sessão.' : 'Cada descoberta fica salva neste navegador.'}</span><button onClick={() => setReset(true)}>Recomeçar fase</button></div>
    </main><Confirmacao aberta={reset} titulo="Recomeçar esta missão?" texto="Só esta bancada volta ao início. Suas outras missões, estrelas conquistadas e temas ficam guardados." cancelar={() => setReset(false)} confirmar={() => { setReset(false); acao({ tipo: 'recomecar' }); }}/></>;
}
