export type Contato = 'NA' | 'NF';
export type TipoComponente = 'fonte' | 'disjuntor' | 'termico' | 'botoeira' | 'contatora' | 'lampada' | 'motor';
export type Terminal = { nome: string; x: number; y: number };
export type Componente = { id: string; tag: string; tipo: TipoComponente; nome: string; x: number; y: number; terminais: Terminal[]; contato?: Contato; retencao?: boolean };
export type Conexao = { id: string; de: string; para: string; via?: { x: number; y: number }[] };
export type Circuito = { versao: 1; tensao: 24; componentes: Componente[]; conexoes: Conexao[] };
export type Entradas = { pressionadas: string[]; disjuntorLigado: boolean; termicoDisparado: boolean; emergenciaTravada: boolean };
export type Simulacao = { entradas: Entradas; bobina: boolean; motor: boolean; lampada: boolean; curto: boolean; oscilacao: boolean; disjuntorDisparado: boolean; potenciais: Record<string, number | null>; energizados: string[] };
export type AcaoBancada = { tipo: 'pressionar' | 'soltar'; id: string } | { tipo: 'soltar-todas' | 'disjuntor' | 'termico' | 'emergencia' | 'rearmar-emergencia' };
export const ENTRADAS_INICIAIS: Entradas = { pressionadas: [], disjuntorLigado: true, termicoDisparado: false, emergenciaTravada: false };
export function pino(id: string, terminal: string) { return `${id}:${terminal}`; }
