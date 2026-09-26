export type VarianteCarinha = "feliz" | "dormindo" | "surpresa" | "determinada";
export type TomCarinha = "destaque" | "sucesso" | "primaria" | "suave";

type Props = {
  variante: VarianteCarinha;
  tom?: TomCarinha;
  tamanho?: number;
  className?: string;
  rotulo?: string;
};

const TONS: Record<TomCarinha, { fundo: string; rosto: string; borda: string }> = {
  destaque: {
    fundo: "var(--cor-destaque)",
    rosto: "var(--cor-texto-sobre-destaque)",
    borda: "var(--cor-mascote-moldura-sombra)",
  },
  sucesso: {
    fundo: "var(--cor-sucesso)",
    rosto: "var(--cor-superficie)",
    borda: "var(--cor-sucesso)",
  },
  primaria: {
    fundo: "var(--cor-primaria)",
    rosto: "var(--cor-texto-sobre-primaria)",
    borda: "var(--cor-primaria)",
  },
  suave: {
    fundo: "var(--cor-painel)",
    rosto: "var(--cor-texto-suave)",
    borda: "var(--cor-texto-suave)",
  },
};

/** Rostinho redondo pequeno para decorar (objetivos, abas, estrelas). */
export function Carinha({ variante, tom = "destaque", tamanho = 20, className, rotulo }: Props) {
  const cores = TONS[tom];
  const traco = {
    fill: "none",
    stroke: cores.rosto,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;

  return (
    <svg
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      className={className}
      role={rotulo ? "img" : undefined}
      aria-label={rotulo}
      aria-hidden={rotulo ? undefined : true}
    >
      <circle cx="12" cy="12" r="10.5" fill={cores.fundo} stroke={cores.borda} strokeWidth={1.5} />
      {variante === "feliz" && (
        <g>
          <circle cx="8.6" cy="10" r="1.5" fill={cores.rosto} />
          <circle cx="15.4" cy="10" r="1.5" fill={cores.rosto} />
          <path d="M8 14 Q12 18 16 14" {...traco} />
        </g>
      )}
      {variante === "dormindo" && (
        <g>
          <path d="M6.8 10.5 Q8.6 12.3 10.4 10.5" {...traco} />
          <path d="M13.6 10.5 Q15.4 12.3 17.2 10.5" {...traco} />
          <path d="M10.5 15.5 h3" {...traco} />
        </g>
      )}
      {variante === "determinada" && (
        <g>
          <path d="M6.6 7.4 L10.2 8.8" {...traco} />
          <path d="M17.4 7.4 L13.8 8.8" {...traco} />
          <circle cx="8.8" cy="11" r="1.4" fill={cores.rosto} />
          <circle cx="15.2" cy="11" r="1.4" fill={cores.rosto} />
          <path d="M9 15.4 Q12 17.2 15 15.4" {...traco} />
        </g>
      )}
      {variante === "surpresa" && (
        <g>
          <circle cx="8.6" cy="9.8" r="2" fill={cores.rosto} />
          <circle cx="15.4" cy="9.8" r="2" fill={cores.rosto} />
          <ellipse cx="12" cy="15.6" rx="1.9" ry="2.3" {...traco} />
        </g>
      )}
    </svg>
  );
}
