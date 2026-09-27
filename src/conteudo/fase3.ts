import type { Fase } from '../motor/tipos';
export const FASE_3: Fase = {
  id: 'eletrica-comandos-3', ilha: 'eletrica', zona: 'comandos', dominio: 'eletrica',
  titulo: 'O painel está te contando', resumo: 'Uma proteção atuou. Descubra o que ela está dizendo.',
  cenario: 'sobrecarga', editarDesde: 99, habilidade: 'Diagnosticar antes de rearmar', conquista: 'Pode sair a próxima fornada!',
  introducao: [
    { texto: 'A esteira parou após uma sobrecarga. Na nossa simulação, a causa já foi removida, mas o relé térmico F1 continua disparado.', expressao: 'preocupado' },
    { texto: 'Em uma máquina real, um profissional precisa investigar a causa antes do rearme. Aqui vamos ler a pista de F1 e recuperar o comando virtual.', expressao: 'apontando' },
  ],
  objetivos: [
    { id: 'medir-f1', titulo: 'Encontre a alimentação', area: 'painel', enunciado: 'Selecione F1. Ative Sonda e meça o terminal 95, a entrada do contato térmico.', validar: 'sondar-termico',
      ajudas: { pergunta: 'A alimentação ainda chega à proteção?', dica: 'O contato 95–96 de F1 abre quando o térmico dispara. Vamos começar pela entrada 95.', linha: { alvo: 'f1:95', fala: 'Toque em F1, escolha Sonda e use Sondar 95 no inspetor. A referência continua em A2.' }, solucao: { acao: 'sondar-termico', fala: 'A entrada 95 tem 24 V em relação a A2. A fonte chega a F1; a indicação de disparo explica por que o comando foi interrompido.' } },
      falaAoConcluir: { texto: '24 V na entrada! E a bancada indica F1 disparado. A proteção abriu o caminho, mesmo com alimentação disponível.', expressao: 'curioso' } },
    { id: 'rearmar-termico', titulo: 'Recupere a proteção', area: 'bancada', enunciado: 'Abra Proteções da bancada e toque em Rearmar F1. Observe: rearmar sozinho não deve dar partida.', validar: 'rearmar-termico',
      ajudas: { pergunta: 'Rearmar uma proteção é a mesma coisa que apertar Liga?', dica: 'O selo caiu quando F1 abriu. Fechar novamente a proteção não fecha o auxiliar de Q1.', linha: { alvo: 'f1', fala: 'Na bancada, abra Proteções da bancada e use Rearmar F1. A causa da sobrecarga já foi removida neste cenário virtual.' }, solucao: { acao: 'rearmar-termico', fala: 'Rearmei F1. O caminho está disponível, mas Q1 permanece solta: ainda falta uma nova partida.' } },
      falaAoConcluir: { texto: 'Rearmou e ficou parado. É o que esperávamos com S1 solta: o selo não guarda energia, ele depende da bobina.', expressao: 'feliz' } },
    { id: 'nova-partida', titulo: 'Peça uma nova partida', area: 'bancada', enunciado: 'Agora segure e solte S1. Confira se a esteira volta a girar sozinha.', validar: 'montar-selo',
      ajudas: { pergunta: 'O que precisa fechar por um instante para Q1 puxar novamente?', dica: 'S1 dá a partida; o auxiliar volta a manter a alimentação quando Q1 puxa.', linha: { alvo: 'bancada-s1', fala: 'Use Segurar S1 e depois Soltar S1. O motor deve continuar girando.' }, solucao: { acao: 'montar-selo', fala: 'Dei uma nova partida e soltei S1. O auxiliar fechou novamente e o selo manteve a esteira.' } },
      falaAoConcluir: { texto: 'A fornada voltou! Falta conferir a parada final para encerrar seu plantão na padaria.', expressao: 'feliz' } },
    { id: 'parada-final', titulo: 'Feche o plantão', area: 'bancada', enunciado: 'Com a esteira girando, pressione S3. Depois da parada, sua rota estará completa.', validar: 'inserir-parada',
      ajudas: { pergunta: 'Qual parada permanece acionada até ser rearmada?', dica: 'S3 trava acionada. Aqui observamos o princípio lógico; segurança real de máquinas exige um sistema completo.', linha: { alvo: 's3', fala: 'Pressione S3 na bancada ou no controle de teste. Se a esteira estiver parada, rearme S3 e dê uma partida antes.' }, solucao: { acao: 'inserir-parada', fala: 'Testei S3 com a esteira funcionando. O comando abriu e Q1 soltou.' } },
      falaAoConcluir: { texto: 'Você montou, encontrou um defeito e interpretou uma proteção. Esse painel já conta uma história que você consegue ler.', expressao: 'comemorando' } },
  ],
  conclusao: [{ texto: 'Plantão concluído! Você ganhou o selo Leitor de painéis. As três bancadas continuam disponíveis para experimentar e refazer suas descobertas.', expressao: 'comemorando' }, { texto: 'E a curiosidade continua valendo: o próprio jogo tem um segredo escondido no F12.', expressao: 'curioso' }],
  missaoDeCampo: 'Encontre um diagrama de comando e identifique o contato 95–96 do relé térmico. Conte para alguém por que investigar a causa vem antes do rearme. Não intervenha numa instalação real.',
};
