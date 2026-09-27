import { reduzirEditor, type EstadoEditor, type AcaoEditor } from '../eletrica/editor';
import { criarCenario } from '../eletrica/cenarios';
import { obterFase, faseLiberada } from '../conteudo/campanha';
import { validar, resolver } from './adaptadorEletrico';
import type { Fase, Fala } from './tipos';
export type Tema = 'doce' | 'fliperama' | 'segredo';
export type Partida = {
  editor: EstadoEditor; momento: 'introducao' | 'objetivo' | 'feedback' | 'conclusao';
  objetivo: number; fala: number; degrau: 0 | 1 | 2 | 3 | 4; estrelas: number; missao: boolean;
};
export type EstadoJogo = Partida & {
  faseId: string; partidas: Record<string, Partida>; tema: Tema; som: boolean; segredo: boolean;
  carregado: boolean; salvamentoFalhou: boolean; fasesConcluidas: string[]; estrelasPorFase: Record<string, number>;
};
export type AcaoJogo = { tipo: 'editor'; acao: AcaoEditor } |
  { tipo: 'avancar' | 'ajuda' | 'solucao' | 'recomecar' | 'som' | 'segredo' | 'falha-salvar' } |
  { tipo: 'tema'; tema: Tema } | { tipo: 'missao'; valor: boolean } |
  { tipo: 'carregar'; estado: EstadoJogo } | { tipo: 'abrir-fase'; id: string };
export function partidaInicial(fase: Fase): Partida {
  return { editor: criarCenario(fase.cenario), momento: 'introducao', objetivo: 0, fala: 0, degrau: 0, estrelas: 3, missao: false };
}
export function guardarPartida(s: Partida): Partida {
  const { editor, momento, objetivo, fala, degrau, estrelas, missao } = s;
  return { editor: reduzirEditor(editor, { tipo: 'atuar', acao: { tipo: 'soltar-todas' } }), momento, objetivo, fala, degrau, estrelas, missao };
}
export function jogoInicial(): EstadoJogo {
  const fase = obterFase('eletrica-comandos-1');
  return { ...partidaInicial(fase), faseId: fase.id, partidas: {}, tema: 'doce', som: true, segredo: false, carregado: false, salvamentoFalhou: false, fasesConcluidas: [], estrelasPorFase: {} };
}
export function reduzirJogo(fase: Fase, s: EstadoJogo, a: AcaoJogo): EstadoJogo {
  if (a.tipo === 'carregar') return { ...a.estado, carregado: true };
  if (a.tipo === 'abrir-fase') {
    if (a.id === s.faseId || !faseLiberada(a.id, s.fasesConcluidas)) return s;
    const partidas = { ...s.partidas, [s.faseId]: guardarPartida(s) };
    return { ...s, ...guardarPartida(partidas[a.id] ?? partidaInicial(obterFase(a.id))), faseId: a.id, partidas };
  }
  if (a.tipo === 'falha-salvar') return s.salvamentoFalhou ? s : { ...s, salvamentoFalhou: true };
  if (a.tipo === 'tema') return a.tema === 'segredo' && !s.segredo ? s : { ...s, tema: a.tema };
  if (a.tipo === 'som') return { ...s, som: !s.som };
  if (a.tipo === 'segredo') return { ...s, segredo: true, tema: 'segredo' };
  if (a.tipo === 'missao') return { ...s, missao: a.valor };
  if (a.tipo === 'recomecar') return { ...s, ...partidaInicial(fase) };
  if (a.tipo === 'ajuda') return s.momento === 'objetivo' ? { ...s, degrau: Math.min(3, s.degrau + 1) as 1 | 2 | 3 } : s;
  if (a.tipo === 'avancar') {
    if (s.momento === 'introducao') return s.fala < fase.introducao.length - 1 ? { ...s, fala: s.fala + 1 } : { ...s, momento: 'objetivo', fala: 0, editor: { ...s.editor, eventos: [] } };
    if (s.momento === 'feedback') {
      if (s.objetivo < fase.objetivos.length - 1) return { ...s, momento: 'objetivo', objetivo: s.objetivo + 1, degrau: 0, editor: { ...s.editor, eventos: [] } };
      return { ...s, momento: 'conclusao', fala: 0, fasesConcluidas: [...new Set([...s.fasesConcluidas, fase.id])], estrelasPorFase: { ...s.estrelasPorFase, [fase.id]: Math.max(s.estrelas, s.estrelasPorFase[fase.id] ?? 0) } };
    }
    if (s.momento === 'conclusao') return { ...s, fala: Math.min(s.fala + 1, fase.conclusao.length - 1) };
    return s;
  }
  const objetivo = fase.objetivos[s.objetivo];
  if (a.tipo === 'solucao') {
    if (s.momento !== 'objetivo' || s.degrau < 3) return s;
    const editor = resolver(objetivo.ajudas.solucao.acao, s.editor);
    return { ...s, editor, degrau: 4, estrelas: Math.max(1, s.estrelas - 1), momento: validar(objetivo.validar, editor) ? 'feedback' : 'objetivo' };
  }
  if (a.tipo === 'editor') {
    if ((s.objetivo < fase.editarDesde || s.momento === 'introducao') && (a.acao.tipo === 'editar' || a.acao.tipo === 'desfazer')) return s;
    const editor = reduzirEditor(s.editor, a.acao);
    const passou = s.momento === 'objetivo' && validar(objetivo.validar, editor);
    return { ...s, editor, momento: passou ? 'feedback' : s.momento };
  }
  return s;
}
export function falaAtual(fase: Fase, s: EstadoJogo): Fala {
  if (s.editor.simulacao.curto) return { texto: 'Opa, Q0 abriu! Há um caminho direto entre os polos. Desfaça a ligação e rearme Q0 em Proteções da bancada.', expressao: 'preocupado' };
  if (s.momento === 'introducao') return fase.introducao[s.fala];
  if (s.momento === 'conclusao') return fase.conclusao[s.fala];
  const o = fase.objetivos[s.objetivo];
  if (s.momento === 'feedback') return s.degrau === 4 ? { texto: o.ajudas.solucao.fala, expressao: 'feliz' } : o.falaAoConcluir;
  if (s.degrau === 1) return { texto: o.ajudas.pergunta, expressao: 'curioso' };
  if (s.degrau === 2) return { texto: o.ajudas.dica, expressao: 'pensativo' };
  if (s.degrau >= 3) return { texto: o.ajudas.linha.fala, expressao: 'apontando' };
  if (fase.cenario === 'sem-selo' && o.validar === 'inserir-parada' && s.editor.circuito.componentes.some(c => c.id === 's3')) return { texto: 'S3 já está no diagrama. Ela precisa ficar entre S2 e S1. Ligue a esteira e pressione S3 para testar a parada.', expressao: 'apontando' };
  return { texto: o.enunciado, expressao: 'curioso' };
}
