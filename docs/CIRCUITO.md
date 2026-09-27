# Modelo e notação de circuitos

Versão 1. O modelo é primário; a representação textual é derivada e não editável na Fase 1.

## Gramática planejada

```ebnf
circuito = { componente | conexao | comentario } ;
componente = "COMP", tag, tipo, { propriedade }, fim ;
conexao = terminal, "->", terminal, fim ;
terminal = tag, ".", nomeTerminal ;
propriedade = identificador, "=", valor ;
comentario = "//", texto, fim ;
```

Exemplo de referência, não uma exigência de digitação para jogar:

```
COMP Q1 CONTATORA bobina=24Vcc
COMP S1 BOTOEIRA contato=NA
Q1.13 -> S1.1
Q1.14 -> S1.2
```

A seta denota conectividade, não sentido de corrente. Ramificação = várias conexões no mesmo terminal. Cruzamento sem terminal compartilhado não faz conexão. Tags únicas, IDs internos imutáveis. O serializador emite uma ordem estável. Uma futura importação deve validar tudo antes de trocar o modelo, sem executar JavaScript.

## Semântica

Contato NA fechado quando acionado; NF fechado em repouso. Auxiliar Q1 segue a bobina. Bobina e lâmpada são cargas, portanto não unem seus polos como um fio. Força do motor tem vínculo com os polos principais da contatora, disjuntor e relé térmico. Sem cálculo de corrente ou dinâmica térmica nesta versão; F1 tem entrada de disparo simulado explícita.

Entrada do simulador: montagem e estado anterior mais ação. Saída: novo estado, potenciais de terminais, cargas, proteção e falhas. Reavaliar auxiliares até estabilizar; limitar iterações e detectar oscilação. Desenergizar prevalece quando há curto.

Operações de edição: conectar, desconectar, mudarTag, mudarContato e inserirEmConexao. Inserir substitui o fio em uma única transação. Edições possuem desfazer; saídas elétricas são recalculadas. Estados incoerentes devem produzir diagnóstico legível.

Sonda: referência A2 visível; 24 V, 0 V ou indeterminado. Valor é diferença entre nós, não uma propriedade absoluta do terminal. Terra de proteção não substitui retorno 0 V nem neutro.

U1 identifica a fonte de 24 Vcc. Q0 aberto mantém tensão no lado de entrada; a carga deixa de receber alimentação. Num curto diretamente na fonte, a simulação bloqueia sua saída, além de registrar a proteção disparada. Isso é um limite explícito do modelo didático, sem cálculo de impedância da fonte. Desfazer uma montagem não rearma proteções.

## Projeção e cenários

`layout.ts` projeta o mesmo circuito em paisagem ou retrato sem alterar IDs, conectividade ou notação. A posição dos terminais nunca define uma ligação; somente os pares `de`/`para` do modelo fazem isso. A bandeja de bornes, o toque no SVG e o arraste de mouse disparam a mesma operação de conexão. Selecionar a origem novamente cancela a edição.

`cenarios.ts` prepara as três montagens: falta de selo, parada S2 configurada como NA e sobrecarga com F1 disparado. As duas últimas já incluem selo e S3. Progresso salvo restaura cada montagem sem duplicar componentes. Recarregar mantém disparos e retenção de S3, mas solta as botoeiras momentâneas.

## Oficina autoral

A oficina usa `Projeto` em src/oficina/modelo/tipos.ts. Peças possuem ID estável, identificação, posição, tipo e parâmetros. Ligações apontam para `id:porta`. A exportação JSON é reimportável após validação; a notação CodeMirror das missões antigas permanece em /comandos.

Elétrica: uma fonte ideal de 24 Vcc, condutores e contatos ideais, cargas resistivas equivalentes. Análise nodal permite cargas em série e paralelo; nós sem referência são indeterminados. Curto direto ou corrente acima de 8 A abrem a proteção virtual da bancada. A ligação avariada da luminária só encosta no retorno quando a perturbação é acionada. Não representa a potência de uma soldadora.

Mecânica: ligações entre portas `eixo`. Eixo comum transmite razão +1; engrenamento externo transmite -z1/z2; correia aberta transmite +d1/d2 e cruzada transmite -d1/d2. Relações incompatíveis num ciclo bloqueiam o acionamento. O caminho até o rolete determina a limitação de torque por correia; ramos sem carga não impõem capacidade à saída. A cena resume a saída e o primeiro estágio; o diagrama mantém toda a montagem.

Dinâmica: torque motor decresce com a velocidade, atrito e inércia resistem à aceleração, correia pode limitar esforço. O motor é representado com torque máximo didático de 2 N·m. Tensão da correia é uma escala 0–100, sem unidade de força. O integrador usa subpassos de no máximo 1/120 s e limita intervalos após pausa; a esteira desacelera e as caixas ajustam sua velocidade por aderência. O estado de movimento não é restaurado do armazenamento.
