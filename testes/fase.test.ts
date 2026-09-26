import { describe,it,expect } from 'vitest';
import { FASE_1 } from '../src/conteudo/fase1';
import { jogoInicial,reduzirJogo } from '../src/motor/jogo';
import { seloFunciona,paradaFunciona } from '../src/motor/adaptadorEletrico';
import { adicionarSelo,editar } from '../src/eletrica/operacoes';
import { circuitoInicial } from '../src/eletrica/inicial';
import { desserializar,serializar } from '../src/lib/progresso';
describe('Fase e persistência',()=>{
  it('completa os cinco objetivos pela ajuda com mínimo de uma estrela',()=>{
    let s=jogoInicial();
    for(let n=0;n<3;n++)s=reduzirJogo(FASE_1,s,{tipo:'avancar'});
    for(let objetivo=0;objetivo<5;objetivo++){
      expect(s.objetivo).toBe(objetivo);
      for(let n=0;n<3;n++)s=reduzirJogo(FASE_1,s,{tipo:'ajuda'});
      s=reduzirJogo(FASE_1,s,{tipo:'solucao'});
      expect(s.momento).toBe('feedback');
      s=reduzirJogo(FASE_1,s,{tipo:'avancar'});
    }
    expect(s.momento).toBe('conclusao');expect(s.estrelas).toBe(1);expect(s.fasesConcluidas).toContain(FASE_1.id);
  });
  it('um desvio de S1 não é um selo',()=>{const c=editar(circuitoInicial(),{tipo:'conectar',de:'s1:1',para:'s1:2'});expect(seloFunciona(c)).toBe(false);});
  it('S3 funciona no caminho comum e falha se interromper apenas o auxiliar',()=>{const c=editar(adicionarSelo(circuitoInicial()),{tipo:'inserir',conexaoId:'w5'});expect(paradaFunciona(c)).toBe(true);const errado=editar(adicionarSelo(circuitoInicial()),{tipo:'inserir',conexaoId:'fio-1'});expect(paradaFunciona(errado)).toBe(false);});
  it('restaura montagem e preferências sem manter botão pressionado',()=>{
    let s=jogoInicial();s={...s,momento:'objetivo',objetivo:3,tema:'fliperama'};
    s=reduzirJogo(FASE_1,s,{tipo:'editor',acao:{tipo:'atuar',acao:{tipo:'pressionar',id:'s1'}}});
    const novo=desserializar(serializar(s));expect(novo.objetivo).toBe(3);expect(novo.tema).toBe('fliperama');expect(novo.editor.simulacao.motor).toBe(false);expect(novo.editor.simulacao.entradas.pressionadas).toEqual([]);
  });
  it('dados inválidos e esquema anterior têm fallback',()=>{expect(desserializar('{oops').objetivo).toBe(0);expect(desserializar('{"versao":999}').tema).toBe('doce');const s=desserializar('{"versao":1,"objetivo":100,"estrelas":-2,"tema":"segredo","segredo":false}');expect(s.objetivo).toBe(0);expect(s.estrelas).toBe(3);expect(s.tema).toBe('doce');});
});
