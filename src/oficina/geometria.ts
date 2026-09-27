export function dentes(quantidade:number,raio:number):string {
  const n=Math.max(10,Math.round(quantidade));
  return Array.from({length:n*4},(_,i)=>{const a=i*Math.PI*2/(n*4),r=i%4===0||i%4===3?raio-4:raio+4;return `${i?'L':'M'}${(Math.cos(a)*r).toFixed(2)},${(Math.sin(a)*r).toFixed(2)}`;}).join(' ')+'Z';
}
export const numero=(v:number,casas=1)=>v.toLocaleString('pt-BR',{maximumFractionDigits:casas});
