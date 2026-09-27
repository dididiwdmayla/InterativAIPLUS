import type { Cenario } from '../eletrica/cenarios';
import type { Expressao } from './expressao';
export type Fala = { texto: string; expressao: Expressao };
export type RegraObjetivo = 'selecionar-contatora' | 'sondar-bobina' | 'observar-defeito' | 'montar-selo' | 'inserir-parada' | 'partida-bloqueada' | 'corrigir-parada' | 'testar-desliga' | 'sondar-termico' | 'rearmar-termico';
export type Ajudas = { pergunta: string; dica: string; linha: { alvo: string; fala: string }; solucao: { fala: string; acao: RegraObjetivo } };
export type Objetivo = { id: string; titulo: string; area?: 'painel' | 'bancada'; enunciado: string; validar: RegraObjetivo; ajudas: Ajudas; falaAoConcluir: Fala };
export type Fase = { id: string; ilha: string; zona: string; titulo: string; resumo: string; cenario: Cenario; editarDesde: number; habilidade: string; conquista: string; dominio: 'eletrica'; introducao: Fala[]; objetivos: Objetivo[]; conclusao: Fala[]; missaoDeCampo: string };
