import type { Movimento, Projeto, Transmissao } from './tipos';
export function calcularTransmissao(p: Projeto): Transmissao {
  const motor = p.pecas.find(c => c.tipo === 'motor'), rolete = p.pecas.find(c => c.tipo === 'rolete');
  const razoes: Record<string, number> = motor ? { [motor.id]: 1 } : {};
  const eficiencias: Record<string, number> = motor ? { [motor.id]: 1 } : {};
  let invalida = false, limite = Infinity;
  const fila = motor ? [motor.id] : [];
  while (fila.length) {
    const id = fila.shift()!;
    for (const l of p.ligacoes) {
      const aId = l.de.split(':')[0], bId = l.para.split(':')[0];
      if (aId !== id && bId !== id) continue;
      const a = p.pecas.find(c => c.id === aId), b = p.pecas.find(c => c.id === bId); if (!a || !b) continue;
      let r = l.tipo === 'eixo' ? 1 : a.valor / b.valor;
      if (l.tipo === 'engrenamento' || l.tipo === 'cruzada') r *= -1;
      const outro = aId === id ? bId : aId, rr = razoes[id] * (aId === id ? r : 1 / r);
      if (razoes[outro] !== undefined) { if (Math.abs(razoes[outro] - rr) > .001) invalida = true; }
      else { razoes[outro] = rr; eficiencias[outro] = eficiencias[id] * (l.tipo === 'eixo' ? 1 : .96); fila.push(outro); }
    }
  }
  const razao = rolete ? razoes[rolete.id] ?? 0 : 0, raio = (rolete?.valor ?? 160) / 2000;
  // Capacidade das correias convertida para o eixo de saída; escala didática, não especificação de fabricante.
  if (razao) for (const l of p.ligacoes) if (l.tipo === 'correia' || l.tipo === 'cruzada') {
    const rp = razoes[l.de.split(':')[0]]; if (rp !== undefined) limite = Math.min(limite, 4 * l.tensao / 100 * Math.abs(rp / razao));
  }
  const torque = razao ? 2 / Math.abs(razao) * (eficiencias[rolete!.id] ?? 1) : 0;
  const resistente = (.7 + p.carga * .045) * raio;
  const escorrega = limite < Math.min(torque, resistente * 3);
  const conectada = !!motor && !!rolete && !!razao && !invalida;
  return { razoes, razao, rpm: conectada ? motor.valor * razao : 0, rpmEntrada: motor?.valor ?? 0, torque, capacidade: limite, escorrega, invalida, conectada, raio,
    mensagem: invalida ? 'As ligações exigem rotações incompatíveis. Revise o ciclo da transmissão.' : !conectada ? 'Ligue o motor ao rolete por eixos, engrenagens ou polias.' : escorrega ? 'A correia não consegue transmitir o esforço. Observe o motor girar e a saída perder velocidade.' : razao < 0 ? 'A saída gira ao contrário da entrada. Conte os elementos que invertem o sentido.' : 'Movimento transmitido. A carga e a inércia determinam como a esteira ganha velocidade.' };
}
export function movimentoInicial(): Movimento { return { omega: 0, angulo: 0, omegaEntrada: 0, anguloEntrada: 0, distancia: 0, caixas: [{ x: .1, v: 0 }, { x: 1.1, v: 0 }, { x: 2.1, v: 0 }], entregas: 0 }; }
export function integrar(m: Movimento, t: Transmissao, carga: number, ligada: boolean, segundos: number): Movimento {
  let omega = m.omega, angulo = m.angulo, omegaEntrada = m.omegaEntrada, anguloEntrada = m.anguloEntrada, distancia = m.distancia, entregas = m.entregas;
  const caixas = m.caixas.map(c => ({ ...c }));
  let resto = Math.min(.1, Math.max(0, segundos));
  while (resto > .000001) {
    const dt = Math.min(resto, 1 / 120); resto -= dt;
    const alvoEntrada = ligada ? t.rpmEntrada * Math.PI / 30 : 0;
    omegaEntrada += Math.sign(alvoEntrada - omegaEntrada) * Math.min(Math.abs(alvoEntrada - omegaEntrada), (ligada ? 18 : 7) * dt);
    anguloEntrada += omegaEntrada * dt;
    const livre = Math.abs(t.rpm) * Math.PI / 30, sinal = Math.sign(t.rpm);
    const acionamento = ligada && t.conectada ? sinal * Math.min(t.capacidade, t.torque * Math.max(0, 1 - omega * sinal / Math.max(.01, livre))) : 0;
    const atrito = (.7 + carga * .045) * t.raio, inercia = .035 + carga * t.raio * t.raio;
    const direcao = Math.sign(omega || acionamento);
    const forca = Math.abs(omega) < .001 && Math.abs(acionamento) <= atrito ? 0 : acionamento - direcao * atrito - .006 * omega;
    const nova = omega + forca / inercia * dt;
    omega = !acionamento && nova * omega < 0 ? 0 : nova;
    angulo += omega * dt; const v = omega * t.raio; distancia += v * dt;
    for (const c of caixas) {
      const delta = v - c.v, dv = Math.sign(delta) * Math.min(Math.abs(delta), 1.8 * dt);
      c.v += dv; c.x += c.v * dt;
      if (c.x > 3.2) { c.x -= 3.3; entregas++; } else if (c.x < -.2) { c.x += 3.3; entregas++; }
    }
  }
  return { omega, angulo, omegaEntrada, anguloEntrada, distancia, caixas, entregas };
}
