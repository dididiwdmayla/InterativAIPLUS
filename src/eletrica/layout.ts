import type { Circuito } from './tipos';
type Ponto = { x: number; y: number };
/** Só a apresentação muda: IDs, conexões e modelo elétrico são os mesmos. */
export function apresentarCircuito(circuito: Circuito, estreito: boolean): Circuito {
  if (!estreito) return circuito;
  const centros: Record<string, Ponto> = {
    q0: { x: 100, y: 75 }, f1: { x: 235, y: 75 },
    s2: { x: 80, y: 185 }, s1: { x: 235, y: 185 },
    s3: { x: 80, y: 300 }, q1: { x: 265, y: 405 }, h1: { x: 115, y: 410 },
  };
  const especiais: Record<string, Ponto> = {
    'fonte:+': { x: 25, y: 75 }, 'fonte:0': { x: 25, y: 485 },
    'q1:A1': { x: 265, y: 360 }, 'q1:A2': { x: 265, y: 450 },
    'q1:13': { x: 170, y: 300 }, 'q1:14': { x: 240, y: 300 },
  };
  const vias: Record<string, Ponto[]> = {
    w3: [{ x: 295, y: 75 }, { x: 295, y: 125 }, { x: 35, y: 125 }, { x: 35, y: 185 }],
    w5: [{ x: 340, y: 185 }, { x: 340, y: 345 }, { x: 265, y: 345 }],
    w6: [{ x: 265, y: 485 }],
    w7: [{ x: 320, y: 360 }, { x: 320, y: 470 }, { x: 60, y: 470 }, { x: 60, y: 410 }],
    w8: [{ x: 185, y: 410 }, { x: 185, y: 450 }],
    'w4-a': [{ x: 120, y: 185 }, { x: 120, y: 245 }, { x: 35, y: 245 }, { x: 35, y: 300 }],
    'w4-b': [{ x: 135, y: 300 }, { x: 135, y: 240 }, { x: 195, y: 240 }, { x: 195, y: 185 }],
  };
  return { ...circuito, componentes: circuito.componentes.map(c => {
    const centro = centros[c.id] ?? { x: c.x, y: c.y };
    return { ...c, ...centro, terminais: c.terminais.map(t => ({ ...t,
      ...(especiais[`${c.id}:${t.nome}`] ?? { x: t.x + centro.x - c.x, y: t.y + centro.y - c.y }),
    })) };
  }), conexoes: circuito.conexoes.map(w => {
    let via = vias[w.id];
    const pontas = [w.de, w.para];
    if (pontas.includes('q1:13') && pontas.includes('s1:1')) via = w.de === 'q1:13' ? [{ x: 170, y: 240 }, { x: 210, y: 240 }] : [{ x: 210, y: 240 }, { x: 170, y: 240 }];
    if (pontas.includes('q1:14') && pontas.includes('s1:2')) via = w.de === 'q1:14' ? [{ x: 310, y: 300 }, { x: 310, y: 185 }] : [{ x: 310, y: 185 }, { x: 310, y: 300 }];
    return { ...w, via };
  }) };
}
