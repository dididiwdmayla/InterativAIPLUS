import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { abrirNavegador } from './navegador.mjs';
const salvo=await readFile('test-results/progresso-390.json','utf8');
const {browser,url,fechar}=await abrirNavegador();
try {
  const p=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),erros=[];
  p.on('pageerror',e=>erros.push(e.message));p.on('console',m=>{if(m.type()==='error')erros.push(m.text());});
  await p.addInitScript(progresso=>{
    if(!sessionStorage.getItem('fixture')){localStorage.setItem('interativai:progresso:v1',progresso);sessionStorage.setItem('fixture','1');}
    window.__audioStats={contextos:0,notas:0};const Original=window.AudioContext;
    window.AudioContext=class extends Original {constructor(...args){super(...args);window.__audioStats.contextos++;}createOscillator(){window.__audioStats.notas++;return super.createOscillator();}};
  },salvo);
  await p.goto(url);await p.getByRole('heading',{name:'Essa fornada é sua!'}).waitFor();
  assert.equal(await p.evaluate(()=>window.__audioStats.contextos),0);
  const fundo=await p.locator('.cena-padaria>rect').first().evaluate(e=>getComputedStyle(e).fill);
  await p.getByRole('button',{name:'Ver meu circuito em texto'}).click();
  await p.getByRole('textbox',{name:'Notação do circuito, somente leitura'}).waitFor();
  assert.match(await p.locator('.cm-content').innerText(),/Q1\.13 -> S1\.1/);
  assert.equal(await p.locator('.cm-content').getAttribute('contenteditable'),'false');
  await p.locator('[data-componente="q1"]').click();
  const tag=p.getByLabel('Tag do componente');await tag.fill('Q9');await tag.press('Enter');
  await p.waitForFunction(()=>document.querySelector('.cm-content')?.textContent.includes('Q9.13'));
  assert.equal(await p.locator('.cena-padaria').getByText('Q9',{exact:true}).count(),1);
  await p.getByLabel('Tema',{exact:true}).selectOption('doce');
  assert.equal(await p.locator('.cena-padaria>rect').first().evaluate(e=>getComputedStyle(e).fill),fundo);
  assert.equal(await p.evaluate(()=>window.__audioStats.contextos),1);
  let chamadas=0;p.on('request',r=>{if(r.url().endsWith('/api/tutor'))chamadas++;});
  await p.getByLabel('Pergunte ao computadorzinho').fill('  CuRiOsO  ');await p.getByRole('button',{name:'Enviar pergunta'}).click();
  await p.waitForFunction(()=>document.documentElement.dataset.theme==='segredo');assert.equal(chamadas,0);
  assert.match(await p.locator('[data-segredo]').textContent(),/curioso/);
  assert.match(await (await p.request.get(url)).text(),/<!-- Você me achou pelo F12!/);
  await p.getByRole('button',{name:'Desligar som'}).click();
  await p.reload();await p.getByRole('button',{name:'Ligar som'}).waitFor();
  assert.equal(await p.locator('html').getAttribute('data-theme'),'segredo');assert.equal(await p.evaluate(()=>window.__audioStats.contextos),0);
  await p.getByRole('button',{name:'Fio',exact:true}).click();
  await p.locator('[data-terminal="q0:2"]').click();await p.locator('[data-terminal="fonte:0"]').click();
  await p.getByRole('img',{name:'Computadorzinho preocupado',exact:true}).waitFor();
  await p.getByRole('button',{name:'Desfazer última edição'}).click();
  await p.getByText('Proteções da bancada',{exact:true}).click();await p.getByRole('button',{name:'Rearmar Q0'}).click();
  const liga=p.getByRole('button',{name:/S1 Liga: mantenha/});await liga.focus();await p.keyboard.down('Space');await p.keyboard.up('Space');
  assert.match(await p.locator('.status-motor').innerText(),/girando/);
  await p.getByRole('button',{name:'Simular sobrecarga'}).click();assert.match(await p.locator('.status-motor').innerText(),/parado/);
  assert.equal(await p.evaluate(()=>window.__audioStats.contextos),0);
  await p.getByRole('button',{name:'Rearmar F1'}).click();await p.getByLabel('Tema',{exact:true}).selectOption('doce');
  for(const width of [390,768,1024,1440]){await p.setViewportSize({width,height:1000});await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}

  await p.screenshot({path:'test-results/acabamento-doce.png',fullPage:true});
  assert.deepEqual(erros,[]);console.log('Acabamento: CodeMirror, tags, segredo sem API, tema fixo da padaria, áudio após gesto, som salvo, curto/rearme, F1 e quatro larguras passaram.');
} finally {await fechar();}
