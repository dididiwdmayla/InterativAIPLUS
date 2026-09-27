import { circuitoInicial } from './inicial';
import { adicionarSelo, editar } from './operacoes';
import { criarEditor } from './editor';
import { simular } from './simulador';
import { ENTRADAS_INICIAIS } from './tipos';
export type Cenario = 'sem-selo' | 'parada-invertida' | 'sobrecarga';
export function criarCenario(cenario: Cenario) {
  let circuito = circuitoInicial();
  if (cenario !== 'sem-selo') circuito = editar(adicionarSelo(circuito), { tipo: 'inserir', conexaoId: 'w4' });
  if (cenario === 'parada-invertida') circuito = editar(circuito, { tipo: 'contato', id: 's2', contato: 'NA' });
  const editor = criarEditor(circuito);
  if (cenario === 'sobrecarga') editor.simulacao = simular(circuito, { ...ENTRADAS_INICIAIS, termicoDisparado: true });
  return editor;
}
