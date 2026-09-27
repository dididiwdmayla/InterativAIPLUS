import Link from 'next/link';
import { Jogo } from '@/componentes/Jogo';
const PISTA = '<!-- Você me achou pelo F12! Digite a palavra curioso no campo do computadorzinho. -->';
export default function Comandos() { return <><div className="retorno-oficina"><Link href="/">Voltar à oficina</Link></div><Jogo/><div hidden dangerouslySetInnerHTML={{__html:PISTA}}/></>; }
