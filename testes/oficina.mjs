import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { abrirNavegador } from './navegador.mjs';
const {browser,url,fechar}=await abrirNavegador();
await mkdir('test-results',{recursive:true});
try{
 const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'});p.setDefaultTimeout(12000);
 const erros=[];p.on('pageerror',e=>erros.push(e.message));p.on('console',m=>{if(m.type()==='error')erros.push(m.text());});
 const b=n=>p.getByRole('button',{name:n,exact:true}),t=n=>b(n).tap();
 const aba=n=>p.getByRole('tab',{name:n,exact:true}).tap();
 const abrir=nome=>p.locator('.of-ordem').filter({hasText:nome}).tap();
 const ligacoes=()=>p.locator('.of-lista-ligacoes summary').tap();
 const registro=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('interativai:oficina:v1')));
 const aprovado=id=>p.waitForFunction(id=>JSON.parse(localStorage.getItem('interativai:oficina:v1')).sessoes[id]?.concluida,id);
 await p.goto(url);await p.locator('.of-portas').waitFor();await p.screenshot({path:'test-results/oficina-entrada-mobile.png',fullPage:true});
 await p.locator('.of-porta.of-eletrica').tap();await abrir('Silêncio na soldadora');await t('Energizar');await aba('Montagem e inspeção');await t('Medir');await t('Peça F1');await t('Porta F1.95');await t('Porta F1.96');
 await p.waitForFunction(()=>JSON.parse(localStorage.getItem('interativai:oficina:v1')).sessoes.soldadora.medicoes.length===2);
 assert.deepEqual((await registro()).sessoes.soldadora.medicoes.map(m=>m.valor),['24 V','0 V']);
 await t('Desenergizar');await t('Limpar filtro virtual');await t('Rearmar F1');await t('Energizar');await t('Conferir reparo');await aprovado('soldadora');
 await t('Próximo serviço');await abrir('Só apaga quando mexe');await t('Energizar');await t('Mover braço');assert.equal(await b('Rearmar bancada').isEnabled(),false);await t('Desenergizar');await aba('Montagem e inspeção');await ligacoes();await t('Inspecionar S1.2 para H1.1');await t('Recuperar isolação');await t('Rearmar bancada');await t('Energizar');await t('Conferir reparo');await aprovado('luminaria');
 console.log('Elétrica: diagnóstico por tensão, causa térmica e curto intermitente passaram.');
 await t('Início da oficina');await p.locator('.of-porta.of-mecanica').tap();await abrir('O pão está voltando');await t('Ligar transmissão');await t('Parar ensaio');await aba('Montagem e inspeção');await ligacoes();await t('Inspecionar P1.EIXO para P2.EIXO');await p.getByLabel('Tipo de transmissão',{exact:true}).selectOption('correia');await t('Ligar transmissão');await p.waitForFunction(()=>Math.abs(Number(document.querySelectorAll('.of-telemetria strong')[1].textContent.replace(/[^\d,-]/g,'').replace(',','.')))>1);await t('Conferir reparo');await aprovado('retorno');
 await t('Próximo serviço');await abrir('Gira, mas não leva');await t('Ligar transmissão');await t('Parar ensaio');await aba('Montagem e inspeção');await ligacoes();await t('Inspecionar P1.EIXO para P2.EIXO');await p.getByLabel('Tensão da correia',{exact:true}).fill('70');await t('Ligar transmissão');await p.waitForFunction(()=>Number(document.querySelectorAll('.of-telemetria strong')[1].textContent.replace(/[^\d,-]/g,'').replace(',','.'))>1);await t('Conferir reparo');await aprovado('carga');
 await t('Próximo serviço');await abrir('Devagar tem mais força');await t('Ligar transmissão');await t('Parar ensaio');await aba('Montagem e inspeção');await t('Peça E1');await p.getByLabel('Número de dentes',{exact:true}).fill('20');await t('Peça E2');await p.getByLabel('Número de dentes',{exact:true}).fill('40');await t('Ligar transmissão');await p.waitForFunction(()=>Number(document.querySelectorAll('.of-telemetria strong')[1].textContent.replace(/[^\d,-]/g,'').replace(',','.'))< -1);await t('Conferir reparo');await aprovado('ritmo');
 await aba('Máquina e medições');await p.screenshot({path:'test-results/oficina-mecanica-mobile.png',fullPage:true});
 console.log('Mecânica: sentido, tração sob 25 kg e redução por engrenagens passaram.');
 await t('Próximo serviço');await p.locator('.of-criacao').tap();await b('Motor de acionamento +').tap();await b('Rolete da esteira +').tap();await t('Conectar');await t('Peça M1');await t('Porta M1.eixo');await t('Peça R1');await t('Porta R1.eixo');await p.waitForFunction(()=>JSON.parse(localStorage.getItem('interativai:oficina:v1')).sessoes['livre-mecanica'].projeto.ligacoes.length===1);await t('Ligar transmissão');await aba('Máquina e medições');
 await p.waitForFunction(()=>Number(document.querySelectorAll('.of-telemetria strong')[1].textContent.replace(/[^\d,-]/g,'').replace(',','.'))>1);
 await t('Início da oficina');await p.locator('.of-porta.of-eletrica').tap();await p.locator('.of-criacao').tap();
 await b('Fonte 24 V +').tap();await b('Lâmpada 24 V +').tap();await b('Contato NA/NF +').tap();await t('Conectar');
 for(const [a,portaA,c,portaB] of [['U1','+','S1','1'],['S1','2','H1','1'],['H1','2','U1','0']]){await t(`Peça ${a}`);await t(`Porta ${a}.${portaA}`);await t(`Peça ${c}`);await t(`Porta ${c}.${portaB}`);}
 await t('Energizar');await t('Acionar S1');await aba('Máquina e medições');assert.match(await p.locator('.of-maquina').innerText(),/H1 \/ 24 V/);
 const download=p.waitForEvent('download');await t('Exportar projeto');const d=await download;await d.saveAs('test-results/projeto-autoral.json');
 await p.reload();await p.locator('.of-portas').waitFor();await p.locator('.of-porta.of-eletrica').tap();await p.locator('.of-criacao').tap();assert.equal((await registro()).sessoes['livre-eletrica'].projeto.ligacoes.length,3);assert.equal(await b('Energizar').isVisible(),true);
 await p.setViewportSize({width:1440,height:1000});await p.screenshot({path:'test-results/oficina-autoral-desktop.png',fullPage:true});
 await t('Início da oficina');await p.screenshot({path:'test-results/oficina-entrada-desktop.png',fullPage:true});
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(erros,[]);
 console.log('Criação: dois projetos autorais, conexões por toque, operação, exportação e retomada passaram. Sem erros no console.');
}finally{await fechar();}
