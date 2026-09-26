import type { Circuito, Componente } from './tipos';
export const S3: Componente = { id: 's3', tag: 'S3', tipo: 'botoeira', nome: 'Parada de emergência didática', contato: 'NF', retencao: true, x: 440, y: 95, terminais: [{nome:'1',x:415,y:95},{nome:'2',x:465,y:95}] };
export function circuitoInicial(): Circuito { return {
  versao: 1, tensao: 24,
  componentes: [
    {id:'fonte',tag:'U1',tipo:'fonte',nome:'Alimentação de comando',x:35,y:95,terminais:[{nome:'+',x:35,y:95},{nome:'0',x:35,y:335}]},
    {id:'q0',tag:'Q0',tipo:'disjuntor',nome:'Disjuntor geral',x:120,y:95,terminais:[{nome:'1',x:95,y:95},{nome:'2',x:145,y:95}]},
    {id:'f1',tag:'F1',tipo:'termico',nome:'Relé térmico',contato:'NF',x:230,y:95,terminais:[{nome:'95',x:205,y:95},{nome:'96',x:255,y:95}]},
    {id:'s2',tag:'S2',tipo:'botoeira',nome:'Desliga',contato:'NF',x:345,y:95,terminais:[{nome:'1',x:320,y:95},{nome:'2',x:370,y:95}]},
    {id:'s1',tag:'S1',tipo:'botoeira',nome:'Liga',contato:'NA',x:535,y:95,terminais:[{nome:'1',x:510,y:95},{nome:'2',x:560,y:95}]},
    {id:'q1',tag:'Q1',tipo:'contatora',nome:'Contatora',contato:'NA',x:650,y:190,terminais:[{nome:'A1',x:650,y:145},{nome:'A2',x:650,y:235},{nome:'13',x:500,y:225},{nome:'14',x:570,y:225}]},
    {id:'h1',tag:'H1',tipo:'lampada',nome:'Sinalização de comando',x:535,y:285,terminais:[{nome:'1',x:505,y:285},{nome:'2',x:565,y:285}]},
    {id:'m1',tag:'M1',tipo:'motor',nome:'Motor trifásico da esteira',x:0,y:0,terminais:[]},
  ],
  conexoes: [
    {id:'w1',de:'fonte:+',para:'q0:1'}, {id:'w2',de:'q0:2',para:'f1:95'},
    {id:'w3',de:'f1:96',para:'s2:1'}, {id:'w4',de:'s2:2',para:'s1:1'},
    {id:'w5',de:'s1:2',para:'q1:A1',via:[{x:650,y:95}]},
    {id:'w6',de:'q1:A2',para:'fonte:0',via:[{x:650,y:335}]},
    {id:'w7',de:'q1:A1',para:'h1:1',via:[{x:705,y:145},{x:705,y:255},{x:485,y:255},{x:485,y:285}]},
    {id:'w8',de:'h1:2',para:'q1:A2',via:[{x:600,y:285},{x:600,y:235}]},
  ]
}; }
