import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { abrirNavegador } from './navegador.mjs';
const {browser,url,fechar}=await abrirNavegador();
await mkdir('test-results',{recursive:true});
try{
  for(const largura of process.env.TEST_WIDTH?[Number(process.env.TEST_WIDTH)]:[1440,390]){
    const contexto=await browser.newContext({viewport:{width:largura,height:1000},hasTouch:largura<500});
    const p=await contexto.newPage(),erros=[];p.on('pageerror',e=>erros.push(e.message));
    await p.goto(url);
    await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.getByRole('button',{name:'Continuar',exact:true}).click();await p.getByRole('button',{name:'Vamos começar',exact:true}).click();
    await p.locator('[data-componente="q1"]').click();await p.getByRole('button',{name:'Próximo objetivo',exact:true}).click();
    await p.getByRole('button',{name:'Sonda',exact:true}).click();await p.getByRole('button',{name:'Sondar A1',exact:true}).click();await p.getByRole('button',{name:'Próximo objetivo',exact:true}).click();
    const liga=()=>p.getByRole('button',{name:/S1 Liga: mantenha/});
    await liga().focus();await p.keyboard.down('Space');assert.match(await p.locator('.status-motor').innerText(),/girando/);await p.keyboard.up('Space');assert.match(await p.locator('.status-motor').innerText(),/parado/);
    await p.getByRole('button',{name:'Próximo objetivo',exact:true}).click();
    await p.getByRole('button',{name:'Fio',exact:true}).click();
    await p.locator('[data-terminal="q1:13"]').press('Enter');await p.locator('[data-terminal="s1:1"]').press('Enter');
    if(largura>1000)await p.locator('[data-terminal="q1:14"]').dragTo(p.locator('[data-terminal="s1:2"]'));
    else{await p.locator('[data-terminal="q1:14"]').press('Enter');await p.locator('[data-terminal="s1:2"]').press('Enter');}
    await p.reload();await p.getByRole('button',{name:'Recomeçar fase',exact:true}).waitFor();
    assert.equal(await p.locator('.lista-objetivos .feito').count(),3);
    if(largura<1000)await p.getByRole('tab',{name:'Bancada',exact:true}).click();
    await liga().focus();await p.keyboard.down('Space');await p.keyboard.up('Space');assert.match(await p.locator('.status-motor').innerText(),/girando/);
    await p.getByRole('button',{name:'Próximo objetivo',exact:true}).click();
    if(largura<1000)await p.getByRole('tab',{name:'Painel',exact:true}).click();
    await p.getByRole('button',{name:'S3 NF',exact:true}).click();await p.locator('[data-fio="w4"]').press('Enter');
    if(largura<1000)await p.getByRole('tab',{name:/Bancada/}).click();
    await p.getByRole('button',{name:'S3 parada de emergência',exact:true}).click();
    await p.getByRole('button',{name:'Ver conquista',exact:true}).click();
    await p.getByRole('checkbox',{name:'Identifiquei em uma foto ou diagrama real'}).check();
    await p.getByLabel('Tema',{exact:true}).selectOption('fliperama');await p.reload();await p.getByRole('heading',{name:'Essa fornada é sua!'}).waitFor();
    assert.equal(await p.getByRole('checkbox').isChecked(),true);assert.equal(await p.locator('html').getAttribute('data-theme'),'fliperama');assert.equal(await p.locator('.lista-objetivos .feito').count(),5);
    await p.screenshot({path:`test-results/conclusao-${largura}.png`,fullPage:true});
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await p.screenshot({path:`test-results/conclusao-${largura}.png`,fullPage:true});assert.deepEqual(erros,[]);console.log(`Jornada ${largura}: cinco objetivos, arraste/teclado, retomada, tema e missão passaram.`);
    await p.close();
  }
}finally{await fechar();}
