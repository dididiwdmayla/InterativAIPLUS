# InterativAI Oficina

Uma oficina em PT-BR para aprender elétrica e mecânica construindo, investigando e testando. A entrada oferece duas áreas. Cada uma tem manutenção orientada e uma prancheta completamente autoral.

Projeto independente de `dididiwdmayla/interativAI`. O repositório de programação permanece separado.

## O que está jogável

Cinco ordens de serviço:

| Área | Serviço | Descoberta |
|---|---|---|
| Elétrica | Silêncio na soldadora | Comparar tensão antes/depois de F1, remover a causa e rearmar |
| Elétrica | Só apaga quando mexe | Reproduzir e corrigir um curto na articulação de uma luminária |
| Mecânica | O pão está voltando | Correia aberta versus cruzada |
| Mecânica | Gira, mas não leva | Tração e patinagem sob carga |
| Mecânica | Devagar tem mais força | Redução por número de dentes |

O serviço só é aprovado após reproduzir o sintoma, alterar a montagem e comprovar o resultado. Pistas graduais orientam a investigação. O caderno guarda medições e o diagnóstico local interpreta o modelo, sem depender de uma chamada de IA.

Nas bancadas livres, comece vazio: adicione componentes, posicione por toque ou setas, altere propriedades, conecte duas portas, remova, desfaça e teste. Há bornes ampliados e lista de ligações para o celular. Um motor, um rolete e uma fonte por projeto; até 16 peças e 40 ligações. Exporte ou importe JSON validado para guardar variações.

As três missões anteriores de contatora, selo e proteção continuam em `/comandos`, com seu progresso preservado. O movimento da padaria também ganhou aceleração e desaceleração.

## Movimento e limites

A transmissão calcula razão e sentido por dentes ou diâmetros. O torque, a carga, o atrito e a capacidade didática da correia afetam a aceleração. A esteira desacelera ao desligar; caixas ganham velocidade gradualmente. O visor mostra a saída e o primeiro estágio; a prancheta representa todas as conexões. A cena para de redesenhar quando chega ao repouso.

A elétrica representa circuitos fictícios de 24 Vcc e cargas resistivas equivalentes, com análise nodal. A soldadora representa somente seu comando auxiliar, sem potência de soldagem. As bancadas não dimensionam máquinas ou instalações reais. Intervenções reais exigem profissional habilitado.

Movimento reduzido é respeitado; as leituras continuam funcionando. No celular, Máquina e medições / Montagem e inspeção alternam sem perder estado. Controles de operação ficam acessíveis durante a rolagem. Alterações de montagem exigem desligar a bancada.

## Desenvolvimento

Node.js 22 ou superior. `npm ci` e `npm run dev`.

- `npm run build` e `npm run lint`: produção e verificação estática.
- `npm run test:essencial`: sete testes do circuito, transmissão, dinâmica e importação.
- `npm run test:e2e`: um roteiro Chromium por toque cobrindo cinco serviços, duas criações, exportação e retomada. Execute após o build.
- `npm run check:regras`: cores centralizadas, símbolos pictográficos e tipos explícitos proibidos.

Para o navegador, use um Chromium instalado via `CHROMIUM_EXECUTABLE`; `CHROMIUM_ARGS` aceita um array JSON. O roteiro usa a porta 3117, desativa Gemini e salva capturas ignoradas pelo Git em `test-results/`. `npm test` mantém disponíveis os testes anteriores, sem exigir toda a suíte em cada alteração.

Progresso da oficina em `interativai:oficina:v1`; progresso de Comandos em `interativai:progresso:v1`. Preferências e projetos são locais, sem login ou banco. Entrar sempre oferece as duas áreas; ao abrir um serviço/projeto, a montagem salva é retomada desenergizada.

## Tutor opcional em Comandos

Copie `.env.example` para `.env.local` e configure `GEMINI_API_KEY` somente no servidor. `GEMINI_MODEL` permite selecionar o modelo. O tutor das missões em `/comandos` usa a rota POST `/api/tutor`; a oficina nova tem diagnóstico determinístico baseado nos seus modelos. O jogo funciona sem chave.

Documentação: `docs/PROJETO.md`, `docs/PROGRESSO.md` e `docs/CIRCUITO.md`. Laboratório do personagem em `/lab/mascote`. Deploy compatível com Next.js na Vercel.
