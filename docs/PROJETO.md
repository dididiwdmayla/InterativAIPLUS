# InterativAI PLUS

## Contrato

Jogo para iniciantes: Ilha Elétrica > Comandos. A primeira entrega trouxe a fase "O painel é seu". Na Padaria Pão Quentinho, a esteira só funciona enquanto S1 está pressionada. O jogador identifica Q1, mede A1, observa o defeito, conecta o selo e insere S3 NF em série. Aprender experimentando, feedback imediato, falas breves, nenhuma digitação obrigatória.

Na segunda rodada, o usuário ampliou o escopo para várias fases, montagem adequada ao celular, orientação mais presente e testes essenciais. A campanha agora tem três missões e doze objetivos: montar o selo, investigar uma parada configurada como NA e interpretar/recuperar um relé térmico virtual. As outras zonas permanecem futuras.

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

Persistência: interativai:progresso:v1. A chave é mantida; o schema 2 migra o schema 1 deste aplicativo e guarda partidas por fase. Schema validado, try/catch, fallback. Guardar circuito, objetivo, estrelas, ajudas, falas, temas, som e missão. Recarregar libera botoeiras momentâneas e preserva proteções disparadas. Não ler nem migrar dados do jogo de programação.

Tutor: POST /api/tutor; entrada faseId, objetivoId, enunciado, degrauAtual, circuitoAtual, pergunta, historico (últimas seis mensagens). Saída texto e expressao. Troca de htmlAtual por circuitoAtual aprovada. Resposta curta, sem solução completa; falha nunca interrompe a fase. GEMINI_API_KEY e GEMINI_MODEL só no servidor.

## Decisões elétricas

- Controle didático em 24 Vcc, retorno 0 V explícito (não chamar de neutro). Motor trifásico e potência representados de modo lógico, alimentação de força fixa nesta fase.
- A sonda mede diferença de potencial entre terminal escolhido e A2, com referência visível. Inicialmente A1-A2 = 0 V. Circuito flutuante ou inválido não deve se disfarçar de medição válida.
- Q1 inclui bobina A1/A2, auxiliar NA 13/14 e contatos de força vinculados. S1 é momentânea NA; S2 momentânea NF; F1 abre contato NF quando disparado; Q0 é disjuntor.
- S3 representa a interrupção NF em série, com retenção. O exercício não constitui um sistema industrial completo de emergência. Rearme com partida solta não religa o motor; o circuito simples não representa supervisão de segurança nem proteção contra todos os defeitos.
- Curto é um caminho de condução sem carga entre polos incompatíveis. Bobina e lâmpada não são fios. A proteção abre e mantém o disparo até rearme.
- A missão externa é identificar contatora e selo em foto/diagrama. Não convidar iniciantes a abrir, tocar ou trabalhar em painel real energizado. Atividade presencial acompanhada por profissional habilitado.

## Visual e experiência

Doce: pastéis, rosa e violeta; Fliperama: neon; Segredo desbloqueável. Bancada da padaria tem paleta fixa. No diagrama lógico de 24 Vcc, laranja/cinza indicam potencial; a legenda explicita esse estado, sem representar cor física de isolamento. Tokens de fase, neutro e terra ficam preparados para os próximos domínios. Símbolos e rótulos também comunicam, sem depender só de cor.

Desktop: rota/estrelas, guia acima da área de trabalho, diagrama e inspetor à esquerda, bancada à direita. No móvel, Painel e Bancada alternáveis mantendo estado; cada objetivo escolhe sua área inicial. O guia acompanha a rolagem e o controle de teste fica fixo no rodapé. O tutor conversacional é expansível para manter o foco na missão.

A rota Monte/Investigue/Recupere desbloqueia uma missão por vez, permite retomar as anteriores e entrega o selo Leitor de painéis ao concluir as três. O modelo continua único; o SVG recebe uma projeção em retrato abaixo de 600 px. Fios usam dois toques em terminais ou uma bandeja de bornes ampliados por peça. Mouse continua aceitando arraste; toque não captura o ponteiro nem impede a rolagem. Os controles não mudam de altura durante a conexão. Inserção em fio tem alvo circular com sinal +. Todos os gestos têm alternativa por teclado.

O dedo virtual do controle de teste representa manter S1 pressionada, com estado e ação Soltar explícitos. A botoeira continua momentânea no simulador. A troca de fase e o recarregamento liberam essa entrada.

Validação da segunda rodada concentrada no núcleo/campanha e em um percurso real de toque com uma regressão de mouse/teclado. Os roteiros anteriores de navegador foram substituídos por esse percurso, sem repetir a varredura de temas, som e larguras já realizada na primeira entrega.

## Referências técnicas

- https://nextjs.org/docs/app/getting-started/fonts
- https://www.se.com/pt/pt/faqs/FA110040/ (A1/A2)
- https://www.se.com/us/en/faqs/FA112430/ (auxiliares 13/14 e 21/22)
- https://www.se.com/uk/en/faqs/FA23719/ (parada e rearme)

## Fora de escopo

Fases além das três missões de Comandos, Ilha Mecânica, editor textual bidirecional, cálculo analógico de corrente/queda de tensão, dimensionamento, certificação de segurança funcional, login, banco e publicação automática em produção.

## Rodada 3: oficina própria

Nova autorização: mudança ampla de identidade, mecânica jogável, manutenção e criação autoral nos dois domínios. A entrada passa a ser a escolha Elétrica/Mecânica. A experiência usa ordens de serviço, máquinas, instrumentos e prancheta de montagem. As três missões anteriores permanecem em /comandos, com seu progresso preservado.

Modelo de oficina independente em src/oficina/modelo: peças, portas, ligações, cenários e medições serializáveis. Elétrica de 24 Vcc com conectividade e análise nodal de cargas resistivas equivalentes; não modela potência de soldagem nem propõe reparo em soldadora real. A falha intermitente só aparece quando a articulação se move. A soldadora exige remover a obstrução virtual antes de rearmar.

Mecânica: grafo cinemático com eixo, engrenamento externo, correia aberta/cruzada. Relações vêm de dentes/diâmetros, ciclos contraditórios são bloqueados. Torque disponível e capacidade didática da correia limitam a aceleração; integração em passos de até 1/120 s inclui inércia da carga, atrito, desaceleração e aderência das caixas à esteira. Dentes e rodas são símbolos, sem cálculo de perfil, distância entre eixos ou dimensionamento. Tensão da correia é uma escala didática, não força prescrita.

Bancada autoral inicia vazia: inserir/remover/mover peças, nomear, ligar, desfazer, operar e medir. Um motor, um rolete e uma fonte por projeto; até 16 peças e 40 ligações. Exportação/importação validada de projeto; rascunhos separados dos serviços. Persistência em interativai:oficina:v1; cada entrada sempre oferece as duas áreas.

Referências de modelo: KHK, Direction of Rotation of Gears e Calculation of Gear Dimensions; OpenStax, Newton's Second Law for Rotation; Gates, Preventive Maintenance Manual. A física é didática; não é um cálculo de seleção de componentes reais.
