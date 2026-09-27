import { circuitoInicial } from './inicial';
import { editar,type Edicao } from './operacoes';
import { simular,atuar,medir } from './simulador';
import type { Circuito,Simulacao,AcaoBancada } from './tipos';
export type TipoEvento='selecionou'|'sondou'|'editouTag'|'editouTerminal'|'editouConexao'|'pressionouBotoeira'|'editouCodigo'|'operouProtecao';
export type Evento={tipo:TipoEvento;alvo:string;motor:boolean;motorAntes?:boolean;valor?:number|null;pressionada?:boolean};
export type EstadoEditor={circuito:Circuito;simulacao:Simulacao;selecionado:string|null;terminal:string|null;eventos:Evento[];passado:Circuito[];aviso:string};
export type AcaoEditor={tipo:'selecionar';id:string}|{tipo:'sondar';terminal:string}|{tipo:'editar';edicao:Edicao}|{tipo:'atuar';acao:AcaoBancada}|{tipo:'desfazer'}|{tipo:'restaurar';circuito:Circuito};
export function criarEditor(circuito=circuitoInicial()):EstadoEditor{return{circuito,simulacao:simular(circuito),selecionado:null,terminal:null,eventos:[],passado:[],aviso:'Clique em uma peça para conhecê-la.'};}
export function reduzirEditor(s:EstadoEditor,a:AcaoEditor):EstadoEditor{
  let n=s,evento:Evento|undefined;
  if(a.tipo==='restaurar')return criarEditor(a.circuito);
  if(a.tipo==='selecionar'){n={...s,selecionado:a.id,aviso:'Peça selecionada. Seus terminais estão no inspetor.'};evento={tipo:'selecionou',alvo:a.id,motor:s.simulacao.motor};}
  if(a.tipo==='sondar'){n={...s,terminal:a.terminal,selecionado:a.terminal.split(':')[0],aviso:'Medição atualizada. A referência é A2.'};evento={tipo:'sondou',alvo:a.terminal,valor:medir(s.simulacao,a.terminal),motor:s.simulacao.motor};}
  if(a.tipo==='editar'){
    const circuito=editar(s.circuito,a.edicao);
    if(circuito===s.circuito)return{...s,aviso:'Essa alteração não é válida. Confira os terminais ou a tag.'};
    n={...s,circuito,simulacao:simular(circuito,s.simulacao.entradas,s.simulacao),passado:[...s.passado.slice(-29),s.circuito],aviso:'Conexão atualizada. Veja o que mudou na bancada.'};
    evento={tipo:a.edicao.tipo==='tag'?'editouTag':a.edicao.tipo==='contato'?'editouTerminal':'editouConexao',alvo:'id' in a.edicao?a.edicao.id:'circuito',motor:n.simulacao.motor,motorAntes:s.simulacao.motor};
  }
  if(a.tipo==='desfazer'){
    const circuito=s.passado.at(-1);if(!circuito)return s;
    n={...s,circuito,simulacao:simular(circuito,s.simulacao.entradas,s.simulacao),passado:s.passado.slice(0,-1),aviso:'Última alteração desfeita.'};evento={tipo:'editouConexao',alvo:'desfazer',motor:n.simulacao.motor,motorAntes:s.simulacao.motor};
  }
  if(a.tipo==='atuar'){
    n={...s,simulacao:atuar(s.circuito,s.simulacao,a.acao)};
    if(a.acao.tipo==='emergencia')evento={tipo:'pressionouBotoeira',alvo:'s3',pressionada:true,motor:n.simulacao.motor,motorAntes:s.simulacao.motor};
    if(a.acao.tipo==='pressionar'||a.acao.tipo==='soltar')evento={tipo:'pressionouBotoeira',alvo:a.acao.id,pressionada:a.acao.tipo==='pressionar',motor:n.simulacao.motor,motorAntes:s.simulacao.motor};
    if(a.acao.tipo==='termico'||a.acao.tipo==='disjuntor')evento={tipo:'operouProtecao',alvo:a.acao.tipo==='termico'?'f1':'q0',motor:n.simulacao.motor};
  }
  return evento?{...n,eventos:[...s.eventos.slice(-99),evento]}:n;
}
