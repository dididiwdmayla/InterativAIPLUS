# InterativAI PLUS

Uma aventura em PT-BR para aprender elétrica industrial, predial e mecânica básica experimentando em uma bancada virtual.

Projeto independente de `dididiwdmayla/interativAI`, usado apenas como referência de linguagem visual e filosofia. Nenhuma dependência de código ou progresso entre os aplicativos.

## Desenvolvimento

Node.js 22 ou superior. Execute `npm ci`, `npm run dev`. Verificação essencial: `npm run build`, `npm run lint`, `npm run test:essencial`.

Comece a leitura por `docs/PROJETO.md`, `docs/PROGRESSO.md` e `docs/CIRCUITO.md`.

Deploy: Next.js na Vercel. O jogo funciona sem chave de IA. A integração do tutor usa exclusivamente variáveis de ambiente do servidor.

## Tutor opcional

Copie `.env.example` para `.env.local` e preencha `GEMINI_API_KEY`. Na Vercel, cadastre essa variável nas configurações do projeto. `GEMINI_MODEL` permite trocar o modelo; o padrão é `gemini-3.8-flash`, listado como Flash estável na documentação oficial consultada em 26/09/2026. A chave é lida apenas pela rota POST `/api/tutor`. Nunca use prefixo `NEXT_PUBLIC_`.

Sem chave, limite de API ou falha de rede, o computadorzinho oferece a ajuda local. As três missões funcionam sem Gemini. O tutor recebe a pergunta, as últimas seis mensagens e a notação do circuito, sem identificação pessoal.

Referências: [SDK oficial](https://ai.google.dev/gemini-api/docs/libraries), [modelos](https://ai.google.dev/gemini-api/docs/models), [saída estruturada](https://ai.google.dev/gemini-api/docs/structured-output). A integração usa `responseMimeType` e `responseJsonSchema`, presentes nos tipos públicos da versão instalada de `@google/genai`.

## O que está jogável

Três missões na Ilha Elétrica, zona Comandos, com doze objetivos e uma rota de desbloqueio:

1. **O painel é seu:** conhecer Q1, medir A1, descobrir a falta de selo, montar e testar duas paradas.
2. **O botão que não obedece:** investigar a partida bloqueada, corrigir S2 de NA para NF e comprovar o conserto.
3. **O painel está te contando:** sondar F1, recuperar uma proteção virtual após a causa já removida, dar nova partida e parar com S3.

O computadorzinho acompanha um objetivo por vez, sempre perto da área de trabalho. Me ajuda oferece pergunta, dica, destaque e solução com custo de uma estrela (mínimo de uma). Cada missão guarda sua própria retomada; Recomeçar fase preserva conquistas e temas. O progresso antigo migra automaticamente na mesma chave local.

No celular, o diagrama se reorganiza em retrato. Use Fio e toque em duas pontas: diretamente no desenho ou selecionando a peça e seus bornes ampliados. Toque novamente na origem ou em Cancelar fio para desistir; Desfazer remove a última edição. Para inserir S3, toque no sinal + de um fio. O gesto de rolar a página continua livre.

O controle de teste fica fixo no rodapé móvel. Segurar S1 mantém um dedo virtual na botoeira; Soltar S1 retira esse dedo. Assim você observa o diagrama enquanto opera o comando. A bancada também aceita pressionar e soltar diretamente.

No computador, fios também aceitam arraste. Pelo teclado, Tab/setas navegam e Enter escolhe; Esc cancela um fio e Delete remove o fio focado. Na bancada, mantenha Espaço ou Enter para segurar S1/S2. A sonda compara o ponto escolhido com A2. Após a conquista, Ver meu circuito em texto abre a notação derivada em CodeMirror.

A bancada é uma simulação lógica de 24 Vcc; não dimensiona instalações e não constitui projeto de emergência de máquina. A missão externa é observar foto/diagrama, sem intervenção em equipamento real.

## Verificação

- `npm run build` e `npm run lint`: produção e TypeScript estrito.
- `npm run test:essencial`: 14 testes de simulação, desbloqueio das três missões, migração e retomada. `npm test` mantém a suíte unitária completa disponível quando necessária.
- `npm run check:regras`: símbolos pictográficos, cores e tipos explícitos proibidos.
- `npx playwright install chromium` e `npm run test:e2e`: um percurso por toque nas três missões e uma regressão curta de arraste/teclado. Inclui cancelamento, recarregamento e ausência de erros no console. Execute após o build. O roteiro usa a porta local 3117 e desativa a chave de IA durante os testes.

Para um Chromium já instalado, use `CHROMIUM_EXECUTABLE`; `CHROMIUM_ARGS` aceita um array JSON. As capturas de verificação ficam em `test-results/` e não entram no Git. A rota `/lab/mascote` reúne as sete expressões nos três temas.

As outras zonas e a futura Ilha Mecânica permanecem reservadas. Para acrescentar conteúdo, use os tipos de `src/motor`, o adaptador de domínio e a separação entre modelo, operações e renderização.
