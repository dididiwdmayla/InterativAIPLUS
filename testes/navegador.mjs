import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
export async function abrirNavegador() {
  const url='http://127.0.0.1:3117';
  const servidor=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','3117','--hostname','127.0.0.1'],{stdio:'pipe',env:{...process.env,GEMINI_API_KEY:''}});
  for(let n=0;n<100;n++){try{const r=await fetch(url);if(r.ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_EXECUTABLE||undefined,args:process.env.CHROMIUM_ARGS?JSON.parse(process.env.CHROMIUM_ARGS):[],headless:true});
  return {browser,url,fechar:async()=>{await browser.close();servidor.kill();}};
}
