import { Jogo } from '@/componentes/Jogo';
const PISTA = '<!-- Você me achou pelo F12! Digite a palavra curioso no campo do computadorzinho. --><span data-segredo>Você me achou pelo F12! Digite a palavra curioso no campo do computadorzinho.</span>';
export default function Home() {
  return <><Jogo/><div hidden dangerouslySetInnerHTML={{ __html: PISTA }}/></>;
}
