import { expect, it } from 'vitest';
import { ORDENS } from '../src/oficina/modelo/ordens';
import { calcularEletrica } from '../src/oficina/modelo/eletrica';
import { calcularTransmissao, integrar, movimentoInicial, medirRotacao } from '../src/oficina/modelo/mecanica';
import { lerProjeto, conectar } from '../src/oficina/modelo/operacoes';
import { ENTRADAS } from '../src/oficina/modelo/tipos';
const projeto = (id:string) => structuredClone(ORDENS.find(o=>o.id===id)!.projeto);
it('curto da luminária depende do movimento e desaparece após reparar a isolação',()=>{
 const p=projeto('luminaria'),e={...ENTRADAS,ligada:true};
 expect(calcularEletrica(p,e).cargas.h1).toBeCloseTo(24);
 expect(calcularEletrica(p,{...e,perturbacao:true}).curto).toBe(true);
 p.ligacoes[2].avaria=false;
 expect(calcularEletrica(p,{...e,perturbacao:true}).cargas.h1).toBeCloseTo(24);
 expect(calcularEletrica(p,{...e,disparado:true}).cargas.h1).toBe(0);
});
it('relé térmico aberto separa entrada energizada da carga sem tensão',()=>{
 const p=projeto('soldadora'),e={...ENTRADAS,ligada:true},r=calcularEletrica(p,e);
 expect(r.potenciais['f1:95']).toBe(24);expect(r.potenciais['f1:96']).toBe(0);expect(r.cargas.k1).toBe(0);
 p.pecas.find(c=>c.id==='f1')!.avaria=false;
 expect(calcularEletrica(p,e).cargas.k1).toBe(24);
});
it('circuito autoral calcula duas cargas em série sem inventar 24 V em cada uma',()=>{
 let p=projeto('soldadora');p.ligacoes=[];p=conectar(p,'u1:+','h1:1','fio');p=conectar(p,'h1:2','k1:A1','fio');p=conectar(p,'k1:A2','u1:0','fio');
 const r=calcularEletrica(p,{...ENTRADAS,ligada:true});expect(r.cargas.h1).toBeCloseTo(4);expect(r.cargas.k1).toBeCloseTo(20);
});
it('engrenagens respeitam razão, inversão e rejeitam um ciclo impossível',()=>{
 let p=projeto('ritmo');expect(calcularTransmissao(p).rpm).toBe(-240);
 p.pecas.find(c=>c.id==='e1')!.valor=20;p.pecas.find(c=>c.id==='e2')!.valor=40;expect(calcularTransmissao(p).rpm).toBe(-60);
 p=conectar(p,'m1:eixo','r1:eixo','eixo');expect(calcularTransmissao(p).invalida).toBe(true);
});
it('correia cruzada inverte a saída e tensão insuficiente limita a tração',()=>{
 const p=projeto('retorno');expect(calcularTransmissao(p).rpm).toBe(-60);p.ligacoes[1].tipo='correia';expect(calcularTransmissao(p).rpm).toBe(60);
 const solta=calcularTransmissao(projeto('carga'));expect(solta.escorrega).toBe(true);
 let m=movimentoInicial();for(let i=0;i<100;i++)m=integrar(m,solta,25,true,.02);expect(medirRotacao(solta,m,'p1')).toBeGreaterThan(100);expect(medirRotacao(solta,m,'p2')).toBeCloseTo(0);
 p.ligacoes[1].tensao=70;expect(calcularTransmissao(p).escorrega).toBe(false);
});
it('esteira acelera, transporta caixas e desacelera sem teletransportar após desligar',()=>{
 const p=projeto('retorno');p.ligacoes[1].tipo='correia';const t=calcularTransmissao(p);
 let m=movimentoInicial();for(let i=0;i<200;i++)m=integrar(m,t,p.carga,true,.02);
 expect(m.omega).toBeGreaterThan(1);expect(m.caixas[0].v).toBeGreaterThan(0);
 const anterior=m;m=integrar(m,t,p.carga,false,.02);expect(m.omega).toBeLessThan(anterior.omega);expect(m.omega).toBeGreaterThan(0);expect(m.distancia).toBeGreaterThan(anterior.distancia);
 for(let i=0;i<1500;i++)m=integrar(m,t,p.carga,false,.02);expect(m.omega).toBeCloseTo(0,2);
});
it('importação aceita os cinco cenários e rejeita referências inválidas',()=>{
 for(const o of ORDENS)expect(lerProjeto(o.projeto)).not.toBeNull();const p=projeto('carga');p.ligacoes[0].para='ausente:eixo';expect(lerProjeto(p)).toBeNull();
});
