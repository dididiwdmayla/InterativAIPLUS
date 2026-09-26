# InterativAI PLUS

Uma aventura em PT-BR para aprender elétrica industrial, predial e mecânica básica experimentando em uma bancada virtual.

Projeto independente de `dididiwdmayla/interativAI`, usado apenas como referência de linguagem visual e filosofia. Nenhuma dependência de código ou progresso entre os aplicativos.

## Desenvolvimento

Node.js 22 ou superior. Execute `npm ci`, `npm run dev`. Para verificar: `npm run build`, `npm run lint`, `npm test`.

Comece a leitura por `docs/PROJETO.md`, `docs/PROGRESSO.md` e `docs/CIRCUITO.md`.

Deploy: Next.js na Vercel. O jogo funciona sem chave de IA. A integração do tutor usa exclusivamente variáveis de ambiente do servidor.

## Tutor opcional

Copie `.env.example` para `.env.local` e preencha `GEMINI_API_KEY`. Na Vercel, cadastre essa variável nas configurações do projeto. `GEMINI_MODEL` permite trocar o modelo; o padrão é `gemini-3.8-flash`, listado como Flash estável na documentação oficial consultada em 26/09/2026. A chave é lida apenas pela rota POST `/api/tutor`. Nunca use prefixo `NEXT_PUBLIC_`.

Sem chave, limite de API ou falha de rede, o computadorzinho oferece a ajuda local. A fase inteira funciona sem Gemini. O tutor recebe a pergunta, as últimas seis mensagens e a notação do circuito, sem identificação pessoal.

Referências: [SDK oficial](https://ai.google.dev/gemini-api/docs/libraries), [modelos](https://ai.google.dev/gemini-api/docs/models), [saída estruturada](https://ai.google.dev/gemini-api/docs/structured-output). A integração usa `responseMimeType` e `responseJsonSchema`, presentes nos tipos públicos da versão instalada de `@google/genai`.
