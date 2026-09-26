/** Moldura, tela, pescoço e base do computadorzinho. O rosto vai por cima. */
export function CorpoMonitor() {
  return (
    <g>
      <rect x="42" y="112" width="56" height="12" rx="6" fill="var(--cor-mascote-base)" />
      <rect x="61" y="98" width="18" height="17" rx="4" fill="var(--cor-mascote-moldura-sombra)" />
      <rect x="18" y="27" width="104" height="78" rx="25" fill="var(--cor-mascote-moldura-sombra)" />
      <rect x="18" y="22" width="104" height="78" rx="25" fill="var(--cor-mascote-moldura)" />
      <rect x="30" y="32" width="80" height="58" rx="15" fill="var(--cor-mascote-tela)" />
      <rect
        x="36"
        y="37"
        width="20"
        height="6"
        rx="3"
        fill="var(--cor-mascote-rosto)"
        opacity={0.12}
      />
      <circle cx="104" cy="95" r="2.2" fill="var(--cor-mascote-tela)" opacity={0.85} />
    </g>
  );
}
