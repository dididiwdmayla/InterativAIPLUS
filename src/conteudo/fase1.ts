import type { Fase } from '../motor/tipos';
export const FASE_1: Fase = {
  resumo: 'A esteira só gira enquanto você segura Liga. Vamos dar autonomia a ela.', cenario: 'sem-selo', editarDesde: 3, habilidade: 'Montar um comando com selo', conquista: 'Essa fornada é sua!',
  id: 'eletrica-comandos-1', ilha: 'eletrica', zona: 'comandos', titulo: 'O painel é seu', dominio: 'eletrica',
  introducao: [
    { texto: 'Tem pão saindo do forno, mas a esteira da Pão Quentinho não fica ligada. Vamos descobrir por quê?', expressao: 'curioso' },
    { texto: 'Painel mostra o desenho; Bancada mostra a padaria. O controle de teste fica à mão para você experimentar enquanto olha o circuito.', expressao: 'apontando' },
    { texto: 'Aqui você pode experimentar e desfazer. Eu vou junto, uma peça de cada vez. Bora dar vida a esse painel?', expressao: 'feliz' },
  ],
  objetivos: [
    { id: 'encontrar-q1', titulo: 'Conheça a contatora', enunciado: 'Encontre Q1 no diagrama e clique nela.', validar: 'selecionar-contatora',
      ajudas: { pergunta: 'Qual peça tem a etiqueta Q1?', dica: 'A contatora usa uma bobina para mover contatos. Procure o retângulo marcado Q1.', linha: { alvo: 'q1', fala: 'É o retângulo destacado no diagrama. Selecione a bobina Q1.' }, solucao: { acao: 'selecionar-contatora', fala: 'Selecionei Q1. A bobina é a parte que puxa os contatos da contatora.' } },
      falaAoConcluir: { texto: 'Achou! Essa é Q1. Quando a bobina recebe tensão, ela puxa os contatos e permite ligar o motor.', expressao: 'feliz' } },
    { id: 'sondar-a1', titulo: 'Encontre a tensão', enunciado: 'Ative Sonda e meça no terminal A1 de Q1.', validar: 'sondar-bobina',
      ajudas: { pergunta: 'Como descobrir se a bobina está recebendo tensão?', dica: 'Use a Sonda. A outra ponteira já está em A2; você escolhe onde encostar a primeira.', linha: { alvo: 'q1:A1', fala: 'Ative Sonda e escolha A1. Também dá para usar o botão Sondar A1 no inspetor.' }, solucao: { acao: 'sondar-bobina', fala: 'Medi A1 em relação a A2. Com S1 solta, o caminho até a bobina fica aberto e a leitura é 0 V.' } },
      falaAoConcluir: { texto: 'Você mediu a tensão da bobina! A leitura compara A1 com A2. Agora vamos ver o que acontece quando você aperta Liga.', expressao: 'curioso' } },
    { id: 'observar-s1', area: 'bancada', titulo: 'Descubra o defeito', enunciado: 'Na bancada, segure S1 Liga e depois solte. Observe a esteira.', validar: 'observar-defeito',
      ajudas: { pergunta: 'O motor continua girando depois que você tira o dedo?', dica: 'S1 é momentânea: o contato só fica fechado enquanto você segura.', linha: { alvo: 'bancada-s1', fala: 'Segure o botão verde S1 e solte. Pelo teclado, mantenha Espaço ou Enter pressionado.' }, solucao: { acao: 'observar-defeito', fala: 'Pressionei e soltei S1: a esteira ligou e parou. Falta um caminho que mantenha a bobina alimentada.' } },
      falaAoConcluir: { texto: 'Viu? Soltou, parou. O painel precisa de um selo: um contato da própria Q1 mantendo a alimentação depois da partida.', expressao: 'pensativo' } },
    { id: 'montar-selo', titulo: 'Faça o motor continuar', enunciado: 'Ligue o auxiliar Q1 em paralelo com S1. Depois ligue e solte S1 para testar o selo.', validar: 'montar-selo',
      ajudas: { pergunta: 'Que outro caminho a energia poderia usar quando S1 abrir?', dica: 'O auxiliar NA de Q1 fecha junto com a bobina. Em paralelo com S1, ele mantém o caminho após a partida.', linha: { alvo: 'selo', fala: 'Use Fio: ligue Q1.13 a S1.1 e Q1.14 a S1.2. Toque nas duas pontas do fio. Os bornes ampliados fazem a mesma ligação.' }, solucao: { acao: 'montar-selo', fala: 'Conectei 13–14 em paralelo com S1 e testei. Q1 mantém a própria bobina alimentada até uma parada abrir o comando.' } },
      falaAoConcluir: { texto: 'Agora a fornada anda sozinha! Você fez o selo. S2 ainda consegue parar tudo, porque está antes dos dois caminhos.', expressao: 'comemorando' } },
    { id: 'inserir-s3', titulo: 'Uma segunda parada', enunciado: 'Use S3 NF e toque no + do fio entre S2 e S1. Ligue a esteira e teste S3.', validar: 'inserir-parada',
      ajudas: { pergunta: 'Onde colocar uma parada para interromper também o caminho do selo?', dica: 'S3 deve ficar em série com S2, antes da divisão entre partida e selo. Seu contato NF abre ao pressionar.', linha: { alvo: 'w4', fala: 'Escolha S3 NF e clique no fio destacado, entre S2 e S1. Ligue a esteira e pressione S3 para conferir.' }, solucao: { acao: 'inserir-parada', fala: 'Inseri S3 NF em série, liguei e testei a parada. S3 fica travada; rearmá-la com S1 solta não dá uma nova partida.' } },
      falaAoConcluir: { texto: 'Parou! Você manteve o selo e acrescentou uma segunda parada. Esse é o princípio lógico; uma emergência real precisa de um sistema de segurança completo.', expressao: 'comemorando' } },
  ],
  conclusao: [
    { texto: 'A padaria está pronta para a próxima fornada. Você encontrou a contatora, mediu tensão e montou seu primeiro comando!', expressao: 'comemorando' },
    { texto: 'Esses símbolos também aparecem em diagramas reais. Agora Q1, A1 e o selo já contam uma história para você.', expressao: 'feliz' },
    { texto: 'Ah, e este jogo também é um painel... o que será que tem no F12 dele?', expressao: 'curioso' },
  ],
  missaoDeCampo: 'Encontre uma foto ou um diagrama de um painel real. Identifique a contatora e acompanhe o caminho do selo com os olhos. Para observar uma instalação presencialmente, peça acompanhamento a um profissional habilitado; não abra nem toque no painel.',
};
