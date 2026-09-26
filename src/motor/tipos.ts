import type { Expressao } from './expressao';
export type Fala = { texto: string; expressao: Expressao };
export type RegraObjetivo = 'selecionar-contatora' | 'sondar-bobina' | 'observar-defeito' | 'montar-selo' | 'inserir-parada';
export type Ajudas = { pergunta: string; dica: string; linha: { alvo: string; fala: string }; solucao: { fala: string; acao: RegraObjetivo } };
export type Objetivo = { id: string; titulo: string; enunciado: string; validar: RegraObjetivo; ajudas: Ajudas; falaAoConcluir: Fala };
export type Fase = { id: string; ilha: string; zona: string; titulo: string; dominio: 'eletrica'; introducao: Fala[]; objetivos: Objetivo[]; conclusao: Fala[]; missaoDeCampo: string };
