'use client';
import { motion, useReducedMotion } from 'framer-motion';
const CORES = ['var(--cor-primaria)', 'var(--cor-destaque)', 'var(--cor-secundaria)', 'var(--cor-sucesso)'];
export function Celebracao() {
  const reduzido = useReducedMotion();
  if (reduzido) return null;
  return <svg className="celebracao" viewBox="0 0 1000 450" preserveAspectRatio="none" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <motion.rect key={i} x={30 + (i * 83) % 930} width={i % 2 ? 7 : 11} height={i % 2 ? 14 : 7} rx="2" fill={CORES[i % CORES.length]} initial={{ y: -25, opacity: 0, rotate: 0 }} animate={{ y: 450, opacity: [0, 1, 1, 0], rotate: i % 2 ? 240 : -240 }} transition={{ duration: 2 + (i % 3) * 0.3, delay: (i % 5) * 0.12, ease: 'easeOut' }}/>)}</svg>;
}
