import type { Fase } from '../motor/tipos';
export const FASE_2: Fase = {
  id: 'eletrica-comandos-2', ilha: 'eletrica', zona: 'comandos', dominio: 'eletrica',
  titulo: 'O botão que não obedece', resumo: 'O selo está pronto. Mesmo assim, a esteira não parte.',
  cenario: 'parada-invertida', editarDesde: 1, habilidade: 'Ler contatos NA e NF', conquista: 'Você leu o defeito!',
  introducao: [
    { texto: 'Dia seguinte na padaria. O selo está lá, mas alguém trocou o contato de uma botoeira. Agora Liga parece não funcionar.', expressao: 'preocupado' },
    { texto: 'Hoje você é detetive: teste, procure o caminho interrompido e mude uma única peça. Nenhum fio novo é necessário.', expressao: 'curioso' },
  ],
  objetivos: [
    { id: 'testar-bloqueio', titulo: 'Ouça a pista', area: 'bancada', enunciado: 'Segure S1 e solte. Desta vez, a esteira nem chega a ligar. Percebeu a diferença?', validar: 'partida-bloqueada',
      ajudas: { pergunta: 'A contatora chega a puxar quando você aperta Liga?', dica: 'Um contato aberto antes de S1 pode impedir que a alimentação chegue à bobina.', linha: { alvo: 'bancada-s1', fala: 'Use Segurar S1 e depois Soltar S1 no controle de teste. Observe Q1.' }, solucao: { acao: 'partida-bloqueada', fala: 'Testei S1: Q1 não puxou. O caminho já está interrompido antes da partida.' } },
      falaAoConcluir: { texto: 'Boa pista: nem enquanto segura! Procure agora a botoeira que deveria deixar a energia passar em repouso.', expressao: 'pensativo' } },
    { id: 'corrigir-s2', titulo: 'Encontre o contato trocado', area: 'painel', enunciado: 'Selecione S2 Desliga. Para deixar o comando passar em repouso, ela precisa de NA ou NF? Troque o contato.', validar: 'corrigir-parada',
      ajudas: { pergunta: 'Uma parada deve abrir quando você aperta. Como ela fica antes disso?', dica: 'NF significa normalmente fechado: passa em repouso e abre ao acionar.', linha: { alvo: 's2', fala: 'Selecione S2 e toque em Trocar para NF no inspetor. O pequeno botão NA no desenho também faz a troca.' }, solucao: { acao: 'corrigir-parada', fala: 'Troquei S2 para NF. Em repouso, ela deixa o caminho passar; pressionada, interrompe o comando.' } },
      falaAoConcluir: { texto: 'Era esse contato! Agora vamos provar que Liga e Desliga fazem trabalhos diferentes.', expressao: 'feliz' } },
    { id: 'testar-desliga', titulo: 'Prove o conserto', area: 'bancada', enunciado: 'Segure e solte S1. Com a esteira girando sozinha, aperte S2 Desliga.', validar: 'testar-desliga',
      ajudas: { pergunta: 'O selo mantém o motor, mas quem consegue interrompê-lo?', dica: 'S2 fica antes da divisão entre S1 e o auxiliar. Abrir ali interrompe os dois caminhos.', linha: { alvo: 's2', fala: 'Primeiro Segurar S1, depois Soltar S1 e por último Parar S2 no controle de teste.' }, solucao: { acao: 'testar-desliga', fala: 'Parti, soltei S1 e parei com S2. O selo manteve o motor; o contato NF de parada interrompeu o comando.' } },
      falaAoConcluir: { texto: 'Conserto comprovado. Você não decorou um desenho: entendeu por onde a energia consegue passar.', expressao: 'comemorando' } },
  ],
  conclusao: [{ texto: 'Seu olhar mudou: NA e NF agora são comportamentos. A próxima pista vai estar numa proteção, não numa botoeira.', expressao: 'comemorando' }],
  missaoDeCampo: 'Em um diagrama ou foto de identificação de componentes, procure as marcações NA e NF. Explique qual contato fica fechado em repouso, sem abrir ou tocar numa instalação real.',
};
