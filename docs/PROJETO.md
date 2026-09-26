# InterativAI PLUS

## Contrato

Jogo para iniciantes: Ilha Elétrica > Comandos > Fase 1, "O painel é seu". Na Padaria Pão Quentinho, a esteira só funciona enquanto S1 está pressionada. O jogador identifica Q1, mede A1, observa o defeito, conecta o selo e insere S3 NF em série. Aprender experimentando, feedback imediato, falas breves, nenhuma digitação obrigatória.

Referência original lida integralmente: briefing de 15 seções anexado em 26/09/2026. Referência de código: `dididiwdmayla/interativAI`, commit `b3a5fbd083c8125baad740c2095180aa156db6e8`. O site público não respondeu neste ambiente; o código atual foi consultado diretamente. Temas e personagem conservam a identidade original. O novo repositório não importa rotas, currículo, histórico git nem persistência do jogo de programação.

## Regras

- Etapas 1 a 7, um commit por etapa depois de build e lint verdes; mensagens em PT-BR e PROGRESSO atualizado.
- TypeScript estrito, sem any, um componente por arquivo.
- Interface, documentação e conteúdo em PT-BR; zero emojis.
- Cores exclusivamente em src/tema/tokens.css, incluindo a paleta fixa da instalação.
- Next.js App Router, Tailwind, Framer Motion, CodeMirror 6, Gemini somente no servidor. Sem banco ou login.
- Fontes Nunito e JetBrains Mono via next/font/local e pacotes Fontsource, sem dependência de rede durante o build.

## Arquitetura aprovada

O modelo serializável é a fonte única. SVG, bancada e notação textual derivam dele. IDs internos não mudam quando a tag muda. Núcleo elétrico sem React, eventos tipados e operações atômicas, com desfazer. Estado elétrico transitório separado de montagem e progresso. Contatos auxiliares acompanham a bobina: o selo emerge do circuito, não de uma flag da missão.

O motor pedagógico interpreta dados: Fala, Ajudas, Objetivo, Fase. Só um objetivo ativo; quatro degraus de ajuda. Solução exige confirmação e custa uma estrela, mínimo de uma. Um adaptador de domínio permite a futura mecânica sem implementá-la agora.

Persistência: interativai:progresso:v1. Schema validado, try/catch, fallback. Guardar circuito, objetivo, estrelas, ajudas, falas, temas, som e missão. Recarregar não mantém botoeira pressionada. Não ler nem migrar dados do jogo de programação.

Tutor: POST /api/tutor; entrada faseId, objetivoId, enunciado, degrauAtual, circuitoAtual, pergunta, historico (últimas seis mensagens). Saída texto e expressao. Troca de htmlAtual por circuitoAtual aprovada. Resposta curta, sem solução completa; falha nunca interrompe a fase. GEMINI_API_KEY e GEMINI_MODEL só no servidor.

## Decisões elétricas

- Controle didático em 24 Vcc, retorno 0 V explícito (não chamar de neutro). Motor trifásico e potência representados de modo lógico, alimentação de força fixa nesta fase.
- A sonda mede diferença de potencial entre terminal escolhido e A2, com referência visível. Inicialmente A1-A2 = 0 V. Circuito flutuante ou inválido não deve se disfarçar de medição válida.
- Q1 inclui bobina A1/A2, auxiliar NA 13/14 e contatos de força vinculados. S1 é momentânea NA; S2 momentânea NF; F1 abre contato NF quando disparado; Q0 é disjuntor.
- S3 representa a interrupção NF em série, com retenção. O exercício não constitui um sistema industrial completo de emergência. Rearme com partida solta não religa o motor; o circuito simples não representa supervisão de segurança nem proteção contra todos os defeitos.
- Curto é um caminho de condução sem carga entre polos incompatíveis. Bobina e lâmpada não são fios. A proteção abre e mantém o disparo até rearme.
- A missão externa é identificar contatora e selo em foto/diagrama. Não convidar iniciantes a abrir, tocar ou trabalhar em painel real energizado. Atividade presencial acompanhada por profissional habilitado.

## Visual e experiência

Doce: pastéis, rosa e violeta; Fliperama: neon; Segredo desbloqueável. Bancada da padaria tem paleta fixa. Cores de condutores não mudam com energização: um realce separado mostra o estado. Símbolos e rótulos também comunicam, sem depender só de cor.

Desktop: trilha/estrelas, diagrama e inspetor à esquerda, bancada à direita, mascote/ajuda/tutor abaixo. No móvel, Painel e Bancada alternáveis mantendo estado. Todos os gestos têm alternativa por teclado. Sem mapa completo nem segunda ilha nesta entrega.

## Referências técnicas

- https://nextjs.org/docs/app/getting-started/fonts
- https://www.se.com/pt/pt/faqs/FA110040/ (A1/A2)
- https://www.se.com/us/en/faqs/FA112430/ (auxiliares 13/14 e 21/22)
- https://www.se.com/uk/en/faqs/FA23719/ (parada e rearme)

## Fora de escopo

Outras fases, Ilha Mecânica, editor textual bidirecional, cálculo analógico de corrente/queda de tensão, dimensionamento, certificação de segurança funcional, login, banco e publicação automática em produção.
