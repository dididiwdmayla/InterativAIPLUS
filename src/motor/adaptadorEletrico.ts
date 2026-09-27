import { atuar,simular } from '../eletrica/simulador';
import { adicionarSelo,editar } from '../eletrica/operacoes';
import { circuitoInicial } from '../eletrica/inicial';
import { criarEditor,reduzirEditor,type EstadoEditor } from '../eletrica/editor';
import type { Circuito } from '../eletrica/tipos';
import { criarCenario } from '../eletrica/cenarios';
import type { RegraObjetivo } from './tipos';

function soltouComMotor(e: EstadoEditor, ligado: boolean) {
  const i=e.eventos.findIndex(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s1'&&v.pressionada&&v.motor);
  return i>=0&&e.eventos.slice(i+1).some(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s1'&&!v.pressionada&&v.motor===ligado);
}
export function seloFunciona(c: Circuito) {
  const inicial=simular(c);
  if(inicial.motor||c.componentes.find(p=>p.id==='q1')?.contato!=='NA')return false;
  let s=atuar(c,inicial,{tipo:'pressionar',id:'s1'});
  s=atuar(c,s,{tipo:'soltar',id:'s1'});
  if(!s.motor||s.curto||s.oscilacao)return false;
  if(atuar(c,s,{tipo:'pressionar',id:'s2'}).motor)return false;
  // O auxiliar precisa ser a causa da retenção, não um desvio permanente.
  const semAuxiliar={...c,conexoes:c.conexoes.filter(w=>![w.de,w.para].some(p=>p==='q1:13'||p==='q1:14'))};
  let sem=atuar(semAuxiliar,simular(semAuxiliar),{tipo:'pressionar',id:'s1'});
  sem=atuar(semAuxiliar,sem,{tipo:'soltar',id:'s1'});
  return !sem.motor;
}
export function paradaFunciona(c: Circuito) {
  const s3=c.componentes.find(p=>p.id==='s3');
  if(s3?.contato!=='NF'||!s3.retencao||!seloFunciona(c))return false;
  let s=atuar(c,simular(c),{tipo:'pressionar',id:'s1'});
  s=atuar(c,s,{tipo:'soltar',id:'s1'});
  s=atuar(c,s,{tipo:'emergencia'});
  if(s.motor)return false;
  // S3 precisa impedir a partida mesmo com S1 pressionada.
  if(atuar(c,s,{tipo:'pressionar',id:'s1'}).motor)return false;
  return !atuar(c,s,{tipo:'rearmar-emergencia'}).motor;
}
export function validar(regra: RegraObjetivo,e: EstadoEditor): boolean {
  if(regra==='partida-bloqueada')return e.eventos.some(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s1'&&v.pressionada&&!v.motor)&&e.eventos.some(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s1'&&!v.pressionada&&!v.motor);
  if(regra==='corrigir-parada')return e.circuito.componentes.find(c=>c.id==='s2')?.contato==='NF'&&e.eventos.some(v=>v.tipo==='editouTerminal'&&v.alvo==='s2');
  if(regra==='testar-desliga')return seloFunciona(e.circuito)&&soltouComMotor(e,true)&&!e.simulacao.motor&&e.eventos.some(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s2'&&v.pressionada&&v.motorAntes&&!v.motor);
  if(regra==='sondar-termico')return e.eventos.some(v=>v.tipo==='sondou'&&v.alvo==='f1:95'&&v.valor===24);
  if(regra==='rearmar-termico')return !e.simulacao.entradas.termicoDisparado&&!e.simulacao.motor&&e.eventos.some(v=>v.tipo==='operouProtecao'&&v.alvo==='f1');
  if(regra==='selecionar-contatora')return e.selecionado==='q1';
  if(regra==='sondar-bobina')return e.eventos.some(v=>v.tipo==='sondou'&&v.alvo==='q1:A1'&&v.valor!==null);
  if(regra==='observar-defeito')return soltouComMotor(e,false);
  if(regra==='montar-selo')return seloFunciona(e.circuito)&&soltouComMotor(e,true)&&e.simulacao.motor;
  return paradaFunciona(e.circuito)&&e.eventos.some(v=>v.tipo==='pressionouBotoeira'&&v.alvo==='s3'&&v.pressionada&&v.motorAntes&&!v.motor);
}
export function resolver(regra: RegraObjetivo,e: EstadoEditor): EstadoEditor {
  if(regra==='corrigir-parada')return reduzirEditor(e,{tipo:'editar',edicao:{tipo:'contato',id:'s2',contato:'NF'}});
  if(regra==='sondar-termico')return reduzirEditor(e,{tipo:'sondar',terminal:'f1:95'});
  if(regra==='rearmar-termico'){
    let novo=criarCenario('sobrecarga');
    novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'termico'}});return novo;
  }
  if(regra==='partida-bloqueada'||regra==='testar-desliga'){
    let novo=criarCenario('parada-invertida');
    if(regra==='testar-desliga')novo=reduzirEditor(novo,{tipo:'editar',edicao:{tipo:'contato',id:'s2',contato:'NF'}});
    novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'pressionar',id:'s1'}});
    novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'soltar',id:'s1'}});
    if(regra==='testar-desliga'){novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'pressionar',id:'s2'}});novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'soltar',id:'s2'}});}return novo;
  }
  if(regra==='selecionar-contatora')return reduzirEditor(e,{tipo:'selecionar',id:'q1'});
  if(regra==='sondar-bobina')return reduzirEditor(e,{tipo:'sondar',terminal:'q1:A1'});
  const circuito=regra==='observar-defeito'?circuitoInicial():regra==='montar-selo'?(e.circuito.componentes.some(c=>c.id==='s3')?editar(adicionarSelo(circuitoInicial()),{tipo:'inserir',conexaoId:'w4'}):adicionarSelo(circuitoInicial())):editar(adicionarSelo(circuitoInicial()),{tipo:'inserir',conexaoId:'w4'});
  let novo=criarEditor(circuito);
  novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'pressionar',id:'s1'}});
  novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'soltar',id:'s1'}});
  if(regra==='inserir-parada')novo=reduzirEditor(novo,{tipo:'atuar',acao:{tipo:'emergencia'}});
  return novo;
}
