import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
const arquivos = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(existsSync);
const problemas = [];
for (const arquivo of arquivos) {
  const texto = readFileSync(arquivo, 'utf8');
  if (/[\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(texto)) problemas.push(`${arquivo}: símbolo pictográfico`);
  if (arquivo !== 'src/tema/tokens.css' && /(?:#[0-9a-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\s*\()/i.test(texto)) problemas.push(`${arquivo}: cor literal fora dos tokens`);
  if (/\.tsx?$/.test(arquivo) && /(:\s*any\b|\bas\s+any\b|<any>)/.test(texto)) problemas.push(`${arquivo}: tipo explícito proibido`);
}
if (problemas.length) { console.error(problemas.join('\n')); process.exitCode = 1; }
else console.log(`${arquivos.length} arquivos: sem símbolos pictográficos, cores fora dos tokens ou tipos explícitos proibidos.`);
