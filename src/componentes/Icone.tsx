export type NomeIcone = 'raio' | 'cadeado' | 'som' | 'mudo' | 'seta' | 'sonda' | 'fio' | 'mais' | 'voltar' | 'codigo' | 'mao' | 'estrela' | 'fechar';
const caminhos: Record<NomeIcone, string> = {
  raio: 'M14 2 4 14h7l-1 8 10-13h-7z', cadeado: 'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
  som: 'M3 9h4l5-5v16l-5-5H3z M16 8a6 6 0 0 1 0 8 M19 4a11 11 0 0 1 0 16',
  mudo: 'M3 9h4l5-5v16l-5-5H3z M17 9l5 6 M22 9l-5 6', seta: 'M5 12h14 M13 6l6 6-6 6',
  sonda: 'm5 19 4-4 M9 15l7-10 4 4-10 7z M16 5l2-3 M4 20l-2 2',
  fio: 'M4 4h5v16h11 M2 2h4v4H2z M18 18h4v4h-4z', mais: 'M12 4v16 M4 12h16',
  voltar: 'M8 5 2 11l6 6 M2 11h12a7 7 0 0 1 7 7', codigo: 'm8 5-6 7 6 7 M16 5l6 7-6 7 M14 3l-4 18',
  mao: 'm5 13 4 7h9l3-10-3-1-1 4V4a2 2 0 0 0-4 0v8l-3-3-3 1z', estrela: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z', fechar: 'm5 5 14 14 M19 5 5 19'
};
export function Icone({ nome, tamanho = 20 }: { nome: NomeIcone; tamanho?: number }) {
  return <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={caminhos[nome]} /></svg>;
}
