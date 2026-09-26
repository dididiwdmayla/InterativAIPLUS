import { describe,it,expect } from 'vitest';
import { circuitoInicial } from '../src/eletrica/inicial';
import { editar,adicionarSelo } from '../src/eletrica/operacoes';
import { simular,atuar,medir } from '../src/eletrica/simulador';
describe('Circuito lógico real',()=>{
  it('sem selo só gira durante a pressão de S1',()=>{ const c=circuitoInicial(); let s=simular(c);expect(medir(s,'q1:A1')).toBe(0); s=atuar(c,s,{tipo:'pressionar',id:'s1'});expect(s.motor).toBe(true);expect(medir(s,'q1:A1')).toBe(24);s=atuar(c,s,{tipo:'soltar',id:'s1'});expect(s.motor).toBe(false); });
  it('selo emerge das conexões, S2 o desfaz',()=>{const c=adicionarSelo(circuitoInicial());let s=atuar(c,simular(c),{tipo:'pressionar',id:'s1'});s=atuar(c,s,{tipo:'soltar',id:'s1'});expect(s.motor).toBe(true);expect(s.lampada).toBe(true);s=atuar(c,s,{tipo:'pressionar',id:'s2'});expect(s.motor).toBe(false);s=atuar(c,s,{tipo:'soltar',id:'s2'});expect(s.motor).toBe(false);});
  it('S3 NF em série interrompe e rearme não dá partida',()=>{const c=editar(adicionarSelo(circuitoInicial()),{tipo:'inserir',conexaoId:'w4'});let s=atuar(c,simular(c),{tipo:'pressionar',id:'s1'});s=atuar(c,s,{tipo:'soltar',id:'s1'});s=atuar(c,s,{tipo:'emergencia'});expect(s.motor).toBe(false);s=atuar(c,s,{tipo:'rearmar-emergencia'});expect(s.motor).toBe(false);});
  it.each(['termico','disjuntor'] as const)('%s derruba bobina e o retorno não religa',tipo=>{const c=adicionarSelo(circuitoInicial());let s=atuar(c,simular(c),{tipo:'pressionar',id:'s1'});s=atuar(c,s,{tipo:'soltar',id:'s1'});s=atuar(c,s,{tipo});expect(s.motor).toBe(false);s=atuar(c,s,{tipo});expect(s.motor).toBe(false);});
  it('NA e NF têm comportamentos opostos',()=>{const c=editar(circuitoInicial(),{tipo:'contato',id:'s1',contato:'NF'});const s=simular(c);expect(s.motor).toBe(true);expect(atuar(c,s,{tipo:'pressionar',id:'s1'}).motor).toBe(false);});
  it('curto dispara e permanece até rearme; cargas não são curto',()=>{const c=editar(circuitoInicial(),{tipo:'conectar',de:'q0:2',para:'fonte:0'});const s=simular(c);expect(s.curto).toBe(true);expect(s.disjuntorDisparado).toBe(true);expect(s.motor).toBe(false);expect(atuar(c,s,{tipo:'disjuntor'}).curto).toBe(true);const base=circuitoInicial();expect(atuar(base,simular(base),{tipo:'pressionar',id:'s1'}).curto).toBe(false);});
  it('terminal auxiliar isolado tem tensão indeterminada',()=>{expect(medir(simular(circuitoInicial()),'q1:13')).toBeNull();});
  it('detecta realimentação oscilante sem travar',()=>{const c=editar(adicionarSelo(circuitoInicial()),{tipo:'contato',id:'q1',contato:'NF'});const s=simular(c);expect(s.oscilacao).toBe(true);expect(s.motor).toBe(false);});
  it('trocar a tag não altera a identidade elétrica',()=>{const c=editar(adicionarSelo(circuitoInicial()),{tipo:'tag',id:'q1',tag:'K1'});let s=atuar(c,simular(c),{tipo:'pressionar',id:'s1'});s=atuar(c,s,{tipo:'soltar',id:'s1'});expect(s.motor).toBe(true);});
});
