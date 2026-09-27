import { expect, it } from 'vitest';
import { FASES, obterFase } from '../src/conteudo/campanha';
import { jogoInicial, reduzirJogo, type AcaoJogo, type EstadoJogo } from '../src/motor/jogo';
import { desserializar, serializar } from '../src/lib/progresso';
const agir = (s: EstadoJogo, a: AcaoJogo) => reduzirJogo(obterFase(s.faseId), s, a);
function concluir(s: EstadoJogo) {
  const fase = obterFase(s.faseId);
  while (s.momento === 'introducao') s = agir(s, { tipo: 'avancar' });
  for (let i = s.objetivo; i < fase.objetivos.length; i++) {
    for (let d = 0; d < 3; d++) s = agir(s, { tipo: 'ajuda' });
    s = agir(s, { tipo: 'solucao' }); expect(s.momento, fase.objetivos[i].id).toBe('feedback');
    s = agir(s, { tipo: 'avancar' });
  }
  return s;
}
it('as três missões têm soluções válidas e desbloqueiam a rota sem zerar conquistas', () => {
  let s = jogoInicial();
  expect(agir(s, { tipo: 'abrir-fase', id: FASES[2].id })).toBe(s);
  for (const fase of FASES) { s = agir(s, { tipo: 'abrir-fase', id: fase.id }); s = concluir(s); }
  expect(s.fasesConcluidas).toEqual(FASES.map(f => f.id)); expect(s.estrelas).toBe(1);
  s = agir(s, { tipo: 'abrir-fase', id: FASES[0].id }); expect(s.momento).toBe('conclusao');
});
it('migra o progresso antigo e guarda a retomada de cada missão', () => {
  let s = desserializar(JSON.stringify({ versao: 1, momento: 'conclusao', objetivo: 4, fasesConcluidas: [FASES[0].id], estrelasPorFase: { [FASES[0].id]: 3 }, tema: 'fliperama', missao: true }));
  s = agir(s, { tipo: 'abrir-fase', id: FASES[1].id });
  s = agir(s, { tipo: 'avancar' });
  s = agir(s, { tipo: 'abrir-fase', id: FASES[0].id }); expect(s.missao).toBe(true);
  s = desserializar(serializar(s)); s = agir(s, { tipo: 'abrir-fase', id: FASES[1].id });
  expect(s.fala).toBe(1); expect(s.tema).toBe('fliperama'); expect(s.estrelasPorFase[FASES[0].id]).toBe(3);
  expect(s.editor.circuito.componentes.find(c => c.id === 's2')?.contato).toBe('NA');
});
it('recarregar não rearma F1 nem mantém um dedo virtual pressionado', () => {
  let s = concluir(jogoInicial()); s = concluir(agir(s, { tipo: 'abrir-fase', id: FASES[1].id }));
  s = agir(s, { tipo: 'abrir-fase', id: FASES[2].id });
  s = agir(s, { tipo: 'editor', acao: { tipo: 'atuar', acao: { tipo: 'pressionar', id: 's1' } } });
  s = desserializar(serializar(s));
  expect(s.editor.simulacao.entradas.termicoDisparado).toBe(true); expect(s.editor.simulacao.entradas.pressionadas).toEqual([]);
  s = agir(s, { tipo: 'editor', acao: { tipo: 'atuar', acao: { tipo: 'termico' } } });
  expect(s.editor.simulacao.motor).toBe(false);
});
