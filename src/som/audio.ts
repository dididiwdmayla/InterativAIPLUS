export type EfeitoSonoro = 'clique' | 'acerto' | 'conclusao' | 'aviso' | 'contatora' | 'disjuntor';
let contexto: AudioContext | null = null, saida: GainNode | null = null, ativo = true, ultimoClique = 0;
export function configurarSom(valor: boolean) {
  ativo = valor;
  if (contexto && saida) saida.gain.setTargetAtTime(valor ? 0.16 : 0, contexto.currentTime, 0.012);
}
/** Chame somente de um gesto do jogador. Preferências nunca criam AudioContext. */
export function prepararSom() {
  if (!ativo) return;
  try {
    if (!contexto) { contexto = new AudioContext(); saida = contexto.createGain(); saida.gain.value = 0.16; saida.connect(contexto.destination); }
    if (contexto.state === 'suspended') void contexto.resume().catch(() => {});
  } catch { /* Dispositivo sem áudio: a aventura continua. */ }
}
function nota(frequencia: number, inicio: number, duracao: number, volume = 0.3) {
  if (!contexto || !saida) return;
  const oscilador = contexto.createOscillator(), envelope = contexto.createGain();
  oscilador.type = 'triangle'; oscilador.frequency.value = frequencia;
  envelope.gain.setValueAtTime(0, inicio); envelope.gain.linearRampToValueAtTime(volume, inicio + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);
  oscilador.connect(envelope); envelope.connect(saida); oscilador.start(inicio); oscilador.stop(inicio + duracao + 0.01);
  oscilador.onended = () => { oscilador.disconnect(); envelope.disconnect(); };
}
function estalo(inicio: number, duracao: number, frequencia: number) {
  if (!contexto || !saida) return;
  const buffer = contexto.createBuffer(1, Math.ceil(contexto.sampleRate * duracao), contexto.sampleRate), dados = buffer.getChannelData(0);
  for (let i = 0; i < dados.length; i++) dados[i] = (Math.random() * 2 - 1) * (1 - i / dados.length) ** 3;
  const ruido = contexto.createBufferSource(), filtro = contexto.createBiquadFilter(), ganho = contexto.createGain();
  ruido.buffer = buffer; filtro.type = 'lowpass'; filtro.frequency.value = frequencia; ganho.gain.value = 0.6;
  ruido.connect(filtro); filtro.connect(ganho); ganho.connect(saida); ruido.start(inicio);
  ruido.onended = () => { ruido.disconnect(); filtro.disconnect(); ganho.disconnect(); };
}
export function tocarSom(efeito: EfeitoSonoro) {
  if (!ativo || !contexto || !saida || contexto.state !== 'running') return;
  const agora = contexto.currentTime;
  if (efeito === 'clique') { if (agora - ultimoClique < 0.07) return; ultimoClique = agora; nota(640, agora, 0.05, 0.14); }
  if (efeito === 'acerto') [523.25, 659.25, 783.99].forEach((f, i) => nota(f, agora + i * 0.065, 0.22));
  if (efeito === 'conclusao') [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((f, i) => nota(f, agora + i * 0.1, 0.38));
  if (efeito === 'aviso') { nota(392, agora, 0.15, 0.2); nota(329.63, agora + 0.12, 0.2, 0.18); }
  if (efeito === 'contatora') { estalo(agora, 0.045, 1600); estalo(agora + 0.028, 0.035, 2400); nota(180, agora, 0.06, 0.12); }
  if (efeito === 'disjuntor') { estalo(agora, 0.08, 4000); nota(130, agora, 0.075, 0.15); }
}
