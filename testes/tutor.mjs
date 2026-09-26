import assert from 'node:assert/strict';
import { abrirNavegador } from './navegador.mjs';
const {browser,url,fechar}=await abrirNavegador();
try {
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),erros=[];
  p.on('pageerror',e=>erros.push(e.message)); await p.goto(url);
  const campo=p.getByLabel('Pergunte ao computadorzinho');
  await campo.fill('O que é uma contatora?');await p.getByRole('button',{name:'Enviar pergunta'}).click();
  await p.locator('.balao').getByText('Estou sem sinal agora. Tenta o botão Me ajuda!').waitFor();
  await p.route('**/api/tutor',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({texto:'O que você percebe quando a bobina puxa?',expressao:'curioso'})}));
  await campo.fill('E a bobina?');await p.getByRole('button',{name:'Enviar pergunta'}).click();
  await p.locator('.balao').getByText('O que você percebe quando a bobina puxa?').waitFor();
  await p.unroute('**/api/tutor');await p.route('**/api/tutor',route=>route.abort());
  await campo.fill('E se faltar sinal?');await p.getByRole('button',{name:'Enviar pergunta'}).click();
  await p.locator('.balao').getByText('Estou sem sinal agora. Tenta o botão Me ajuda!').waitFor();
  await p.getByRole('button',{name:'Continuar',exact:true}).click();
  assert.match(await p.locator('.balao').innerText(),/esquerda/);assert.deepEqual(erros,[]);
  const resposta=await p.request.post(`${url}/api/tutor`,{data:{faseId:'inexistente'}});assert.equal(resposta.status(),400);
  console.log('Tutor: sem chave, resposta estruturada simulada, falha de rede e continuidade passaram.');
} finally { await fechar(); }
