import { peca, vazio } from './catalogo';
import { conectar } from './operacoes';
import type { Ordem, Projeto, Sessao } from './tipos';
function soldadora(): Projeto {
  let p = vazio('eletrica'); p.nome = 'Comando auxiliar da soldadora'; p.obstrucao = true;
  p.pecas = [peca('fonte','u1',85,85),peca('disjuntor','q1',280,85),peca('termico','f1',490,85),peca('bobina','k1',490,290),peca('lampada','h1',280,290)];
  p.pecas[2].avaria = true;
  for (const [a,b] of [['u1:+','q1:1'],['q1:2','f1:95'],['f1:96','k1:A1'],['k1:A2','u1:0'],['f1:96','h1:1'],['h1:2','u1:0']]) p = conectar(p,a,b,'fio');
  return p;
}
function luminaria(): Projeto {
  let p = vazio('eletrica'); p.nome = 'Luminária de inspeção';
  p.pecas = [peca('fonte','u1',85,85),peca('disjuntor','q1',280,85),peca('interruptor','s1',490,85),peca('lampada','h1',490,290)]; p.pecas[2].nf = true;
  for (const [a,b] of [['u1:+','q1:1'],['q1:2','s1:1'],['s1:2','h1:1'],['h1:2','u1:0']]) p = conectar(p,a,b,'fio');
  p.ligacoes[2].avaria = true; return p;
}
function correias(invertida: boolean): Projeto {
  let p = vazio('mecanica'); p.nome = invertida ? 'Linha de embalagem' : 'Transporte sob carga'; p.carga = 25;
  p.pecas = [peca('motor','m1',85,110),peca('polia','p1',245,110,80),peca('polia','p2',450,110,160),peca('rolete','r1',450,345)];
  p = conectar(p,'m1:eixo','p1:eixo','eixo'); p = conectar(p,'p1:eixo','p2:eixo',invertida ? 'cruzada' : 'correia'); p = conectar(p,'p2:eixo','r1:eixo','eixo');
  if (!invertida) p.ligacoes[1].tensao = 1; return p;
}
function engrenagens(): Projeto {
  let p = vazio('mecanica'); p.nome = 'Dosador da linha'; p.carga = 8;
  p.pecas = [peca('motor','m1',85,110),peca('engrenagem','e1',245,110,40),peca('engrenagem','e2',450,110,20),peca('rolete','r1',450,345)];
  p = conectar(p,'m1:eixo','e1:eixo','eixo'); p = conectar(p,'e1:eixo','e2:eixo','engrenamento'); return conectar(p,'e2:eixo','r1:eixo','eixo');
}
export const ORDENS: Ordem[] = [
  { id:'soldadora',area:'eletrica',numero:'E.01',titulo:'Silêncio na soldadora',equipamento:'Soldadora · comando auxiliar',relato:'O operador aciona a máquina, mas a contatora não puxa. O sinalizador também está apagado.',conceito:'Proteção e causa da falha',passos:['Energize e sonde a entrada 95 e a saída 96 de F1.','Desenergize. Inspecione a ventilação antes de rearmar F1.','Teste novamente: K1 deve puxar e H1 deve acender.'],dicas:['Compare os dois lados do contato de proteção.','Selecione F1. O filtro obstruído explica o disparo.','Limpe o filtro virtual e depois rearme F1. Energize para comprovar.'],projeto:soldadora() },
  { id:'luminaria',area:'eletrica',numero:'E.02',titulo:'Só apaga quando mexe',equipamento:'Luminária articulada · 24 V',relato:'A luz funciona parada. Quando o braço se move, a proteção abre. O defeito está escondido no movimento.',conceito:'Falha intermitente e curto',passos:['Energize e mova o braço da luminária para reproduzir o defeito.','Desenergize. Inspecione a ligação entre S1 e H1.','Rearme a bancada e teste com o braço em movimento.'],dicas:['A posição da máquina também faz parte do diagnóstico.','O fio de S1.2 para H1.1 passa pela articulação.','Selecione esse fio e recupere a isolação. Rearme e repita o movimento.'],projeto:luminaria() },
  { id:'retorno',area:'mecanica',numero:'M.01',titulo:'O pão está voltando',equipamento:'Esteira · transmissão por polias',relato:'O motor gira, mas a carga volta para o forno. O sentido se perdeu entre duas polias.',conceito:'Correia aberta e cruzada',passos:['Ligue a transmissão e observe o sentido da esteira.','Pare. Selecione a correia entre P1 e P2 e mude sua montagem.','Ligue novamente: a carga deve seguir para a direita.'],dicas:['Siga a transmissão do motor até o rolete.','Correia cruzada inverte o sentido; aberta mantém.','Na ligação P1 → P2, escolha Correia aberta.'],projeto:correias(true) },
  { id:'carga',area:'mecanica',numero:'M.02',titulo:'Gira, mas não leva',equipamento:'Esteira · ensaio sob carga',relato:'A polia motora gira; a esteira quase não sai do lugar. O sintoma piora com a carga.',conceito:'Tração, patinagem e inércia',passos:['Ligue com 25 kg e compare entrada e saída.','Pare. Selecione a correia e ajuste a tensão didática.','Teste com pelo menos 25 kg. A saída deve mover a carga sem patinar.'],dicas:['Girar na entrada não garante transmitir esforço.','Uma correia frouxa limita o torque que chega ao rolete.','Ajuste a tensão para a faixa de 60 a 80 e repita o ensaio com 25 kg.'],projeto:correias(false) },
  { id:'ritmo',area:'mecanica',numero:'M.03',titulo:'Devagar tem mais força',equipamento:'Dosador · par de engrenagens',relato:'A saída está rápida demais. Precisamos reduzir a rotação para 60 rpm em vazio, mantendo o motor em 120 rpm.',conceito:'Relação entre dentes e rotação',passos:['Ligue e compare a rotação calculada da entrada e da saída.','Pare. Mude o número de dentes para uma redução de 2:1.','Ligue: a saída deve ter 60 rpm em vazio, com sentido invertido.'],dicas:['Uma engrenagem maior na saída reduz sua rotação.','A rotação de saída é a de entrada × dentes da entrada ÷ dentes da saída.','Use E1 com 20 dentes e E2 com 40. O engrenamento externo inverte o sentido.'],projeto:engrenagens() },
];
export function iniciar(projeto: Projeto): Sessao { return { projeto: structuredClone(projeto), observou:false, alterou:false, concluida:false, ajuda:0, medicoes:[] }; }
