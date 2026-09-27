'use client';
import type { Circuito } from '@/eletrica/tipos';
export function BornesConexao({ circuito, origem, selecionado, escolherPeca, escolher, cancelar }: {
  circuito: Circuito; origem: string | null; selecionado: string | null; escolherPeca: (id: string) => void;
  escolher: (id: string) => void; cancelar: () => void;
}) {
  const nome = (id: string) => { const [peca, terminal] = id.split(':'); return `${circuito.componentes.find(c => c.id === peca)?.tag}.${terminal}`; };
  const ordem = ['q1', 's1', 's2', 's3', 'f1', 'q0', 'h1', 'fonte'];
  const pecas = circuito.componentes.filter(c => c.terminais.length).sort((a, b) => ordem.indexOf(a.id) - ordem.indexOf(b.id));
  const peca = pecas.find(c => c.id === selecionado) ?? pecas[0];
  return <div className="bornes-conexao" onKeyDown={e => { if (e.key === 'Escape') cancelar(); }}>
    <div className="passos-fio" role="status"><span className={!origem ? 'atual' : 'feito'}>1 · Primeira ponta</span><span className={origem ? 'atual' : ''}>2 · Outra ponta</span></div>
    <div className="resumo-fio"><strong>{origem ? `${nome(origem)} está na sua mão` : 'Escolha a primeira ponta'}</strong><button onClick={cancelar} disabled={!origem}>Cancelar fio</button></div>
    <p>{origem ? 'Escolha a outra peça e toque no borne de chegada.' : 'Selecione a peça abaixo. Os bornes aparecem ampliados.'}</p>
    <div className="seletor-bornes" aria-label="Peças para ligação">{pecas.map(c => <button key={c.id} aria-label={`Peça ${c.tag}`} aria-pressed={c.id === peca.id} onClick={() => escolherPeca(c.id)}>{c.tag}</button>)}</div>
    <div className="bandeja-bornes"><strong>{peca.tag} <span>{peca.tipo === 'contatora' ? 'A1/A2: bobina · 13/14: auxiliar' : peca.nome}</span></strong><div>{peca.terminais.map(t => {
      const id = `${peca.id}:${t.nome}`;
      return <button key={id} className={id === origem ? 'escolhido' : ''} aria-pressed={id === origem} aria-label={`Borne ${peca.tag}.${t.nome}`} onClick={() => escolher(id)}><i aria-hidden="true"/>{t.nome}</button>;
    })}</div></div>
  </div>;
}
