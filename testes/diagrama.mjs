import assert from 'node:assert/strict';
import { abrirNavegador } from './navegador.mjs';
const {browser,url,fechar}=await abrirNavegador();
try {
  const p=await browser.newPage({viewport:{width:1440,height:1000}}),erros=[];
  p.on('pageerror',e=>erros.push(e.message));await p.goto(url);
  await p.locator('[data-componente="q1"]').click();
  await p.getByRole('button',{name:'Sonda',exact:true}).click();
  await p.getByRole('button',{name:'Sondar A1',exact:true}).click();
  assert.match(await p.locator('.visor-sonda').innerText(),/0 V/);
  await p.getByRole('button',{name:'Fio',exact:true}).click();
  await p.locator('[data-terminal="q1:13"]').press('Enter');
  await p.locator('[data-terminal="s1:1"]').press('Enter');
  const inicio=p.locator('[data-terminal="q1:14"]'),fim=p.locator('[data-terminal="s1:2"]');
  await inicio.dragTo(fim);
  const liga=p.getByRole('button',{name:/S1 Liga: mantenha/});
  await liga.focus();await p.keyboard.down('Space');await p.keyboard.up('Space');
  assert.match(await p.locator('.status-motor').innerText(),/girando/);
  await p.getByRole('button',{name:'S3 NF',exact:true}).click();
  await p.locator('[data-fio="w4"]').press('Enter');
  await p.getByRole('button',{name:'S3 parada de emergência',exact:true}).click();
  assert.match(await p.locator('.status-motor').innerText(),/parado/);
  await p.getByRole('button',{name:'Rearmar S3',exact:true}).click();
  assert.match(await p.locator('.status-motor').innerText(),/parado/);
  assert.deepEqual(erros,[]);console.log('Diagrama: teclado, sonda, arraste, selo e S3 passaram.');
} finally { await fechar(); }
