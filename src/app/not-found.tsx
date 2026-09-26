import Link from 'next/link';
export default function NaoEncontrado() {
  return <main className="carregando"><div><h1>Essa ilha ainda não está no mapa.</h1><p>Seu painel está esperando por você.</p><Link className="botao primario" href="/">Voltar à bancada</Link></div></main>;
}
