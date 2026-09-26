import { Mascote } from '@/componentes/mascote/Mascote';
import { Carinha } from '@/componentes/mascote/Carinha';
import { EXPRESSOES, NOMES_EXPRESSOES } from '@/motor/expressao';
export default function Laboratorio() {
  return <main className="laboratorio"><h1>Laboratório do computadorzinho</h1><p>Sete expressões, três temas. Animações respeitam a preferência de movimento reduzido.</p>{['doce','fliperama','segredo'].map(tema=><section key={tema} data-theme={tema}><h2>{tema}</h2><div className="grade-expressoes">{EXPRESSOES.map(expressao=><figure key={expressao}><Mascote expressao={expressao}/><figcaption>{NOMES_EXPRESSOES[expressao]}</figcaption></figure>)}</div><div className="carinhas-lab">{(['feliz','dormindo','surpresa'] as const).map(variante=><Carinha key={variante} variante={variante} rotulo={variante} tamanho={36}/>)}</div></section>)}</main>;
}
