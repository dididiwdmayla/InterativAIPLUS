import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const nunito = localFont({ src: '../../node_modules/@fontsource-variable/nunito/files/nunito-latin-wght-normal.woff2', variable: '--fonte-ui', display: 'swap' });
const mono = localFont({ src: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2', variable: '--fonte-codigo', display: 'swap' });
export const metadata: Metadata = { title: 'InterativAI PLUS | O painel é seu', description: 'Uma aventura para aprender elétrica. Conecte, experimente e veja a padaria ganhar vida.' };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" data-theme="doce" suppressHydrationWarning className={`${nunito.variable} ${mono.variable}`}><head><script dangerouslySetInnerHTML={{ __html: `try{const p=JSON.parse(localStorage.getItem('interativai:progresso:v1')||'{}');if(['doce','fliperama','segredo'].includes(p.tema))document.documentElement.dataset.theme=p.tema}catch{}` }} /></head><body>{children}</body></html>;
}
