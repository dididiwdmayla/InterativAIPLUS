export const EXPRESSOES = [
  "feliz",
  "curioso",
  "pensativo",
  "apontando",
  "comemorando",
  "preocupado",
  "dormindo",
] as const;

export type Expressao = (typeof EXPRESSOES)[number];

export function ehExpressao(valor: unknown): valor is Expressao {
  return typeof valor === "string" && (EXPRESSOES as readonly string[]).includes(valor);
}

export const NOMES_EXPRESSOES: Record<Expressao, string> = {
  feliz: "feliz",
  curioso: "curioso",
  pensativo: "pensativo",
  apontando: "apontando",
  comemorando: "comemorando",
  preocupado: "preocupado",
  dormindo: "dormindo",
};
