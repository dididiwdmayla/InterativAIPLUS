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

## O que está jogável

Uma fase completa: encontrar Q1, medir A1, observar a falha, montar o selo e instalar/testar S3. O botão Me ajuda oferece pergunta, dica, destaque e solução com custo de uma estrela (mínimo de uma). O progresso fica neste navegador; Recomeçar fase preserva conquistas e temas.

No diagrama, clique em dois terminais ou arraste para ligar um fio. Pelo teclado, Tab/setas navegam e Enter escolhe; Esc cancela um fio. Na bancada, mantenha Espaço ou Enter para segurar S1/S2. A sonda compara o ponto escolhido com A2. Após a conquista, Ver meu circuito em texto abre a notação derivada em CodeMirror.

A bancada é uma simulação lógica de 24 Vcc; não dimensiona instalações e não constitui projeto de emergência de máquina. A missão externa é observar foto/diagrama, sem intervenção em equipamento real.

## Verificação

- `npm run build` e `npm run lint`: produção e TypeScript estrito.
- `npm test`: comportamento elétrico, progressão, persistência e contrato do tutor.
- `npm run check:regras`: símbolos pictográficos, cores e tipos explícitos proibidos.
- `npx playwright install chromium` e `npm run test:e2e`: jornada desktop/celular, tutor sem chave, segredo, áudio, lista de fios e proteção. Execute após o build. O roteiro usa a porta local 3117 e desativa a chave de IA durante os testes.

Para um Chromium já instalado, use `CHROMIUM_EXECUTABLE`; `CHROMIUM_ARGS` aceita um array JSON. As capturas de verificação ficam em `test-results/` e não entram no Git. A rota `/lab/mascote` reúne as sete expressões nos três temas.

As outras zonas e a futura Ilha Mecânica permanecem reservadas. Para acrescentar conteúdo, use os tipos de `src/motor`, o adaptador de domínio e a separação entre modelo, operações e renderização.
