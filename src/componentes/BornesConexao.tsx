'use client';
import type { Circuito } from '@/eletrica/tipos';
export function BornesConexao({ circuito, origem, escolher, cancelar }: {
  circuito: Circuito; origem: string | null; escolher: (id: string) => void; cancelar: () => void;
}) {
  const nome = (id: string) => { const [peca, terminal] = id.split(':'); return `${circuito.componentes.find(c => c.id === peca)?.tag}.${terminal}`; };
  return <div className="bornes-conexao" onKeyDown={e => { if (e.key === 'Escape') cancelar(); }}>
    <div className="passos-fio" role="status"><span className={!origem ? 'atual' : 'feito'}>1 · Primeira ponta</span><span className={origem ? 'atual' : ''}>2 · Outra ponta</span></div>
    <div className="resumo-fio"><strong>{origem ? `${nome(origem)} está na sua mão` : 'Monte um fio com dois toques'}</strong>{origem && <button onClick={cancelar}>Cancelar fio</button>}</div>
    <p>{origem ? 'Agora toque no borne de chegada. Tocar na mesma ponta cancela.' : 'Escolha nos bornes abaixo ou direto no desenho.'}</p>
    <div className="grade-bornes">{circuito.componentes.filter(c => c.terminais.length).map(c => <fieldset key={c.id}><legend>{c.tag}<small>{c.tipo === 'contatora' ? 'Bobina / auxiliar' : c.nome}</small></legend><div>{c.terminais.map(t => {
      const id = `${c.id}:${t.nome}`;
      return <button key={id} className={id === origem ? 'escolhido' : ''} aria-pressed={id === origem} aria-label={`Borne ${c.tag}.${t.nome}`} onClick={() => escolher(id)}><i aria-hidden="true"/>{t.nome}</button>;
    })}</div></fieldset>)}</div>
  </div>;
}
