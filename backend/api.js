const MAXIMO_PONTUACOES = 10;
let facil = [];
let medio = [];
let dificil = [];

function novaPontuacao(nome, pontos, tempo, movimentos, dificuldade) {
  return { nome, pontos, tempo, movimentos, dificuldade };
}

function adicionarPontuacao(pontuacao) {
  if (pontuacao.dificuldade == 'facil'){
    facil.push(pontuacao);
    facil.sort((p1,p2) => {p1.pontos - p2.pontos });
    facil = facil.slice(0, MAXIMO_PONTUACOES);
  }
  else if (pontuacao.dificuldade == 'medio'){
    medio.push(pontuacao);
    medio.sort((p1,p2) => {p1.pontos - p2.pontos });
    medio = medio.slice(0, MAXIMO_PONTUACOES);
  }
  else{
    dificil.push(pontuacao);
    dificil.sort((p1,p2) => {p1.pontos - p2.pontos });
    dificil = dificil.slice(0, MAXIMO_PONTUACOES);
  }
}

function validarPostPontuacao(query) {
  const erros = [];

  if (query.nome == undefined) {
    erros.push('Nome não foi informado');
  }

  if (query.pontos == undefined) {
    erros.push('Pontos não foi informado');
  }

  if (query.tempo == undefined) {
    erros.push('Tempo não foi informado');
  }

  if (query.movimentos == undefined) {
    erros.push('Movimentos não foi informado');
  }

  if (query.dificuldade == undefined) {
    erros.push('dificuldade não foi informado');
  }

  return erros;
}

function setup(app, port) {
  app.get('/pontuacao', (_, res) => {
    res.send({facil, medio, dificil});
  });

  app.post('/pontuacao', (req, res) => {
    const erros = validarPostPontuacao(req.query);

    if (erros.length != 0) {
      res.status(400).send({ erros });
      return;
    }

    const nome = req.query.nome;
    const pontos = req.query.pontos;
    const tempo = req.query.tempo;
    const movimentos = req.query.movimentos;
    const dificuldade = req.query.dificuldade;
    const pontuacao = novaPontuacao(nome, parseInt(pontos), tempo, movimentos, dificuldade);

    adicionarPontuacao(pontuacao);

    res.status(200).send(pontuacao);
  });

  app.listen(port, () => {
    console.log(`Iniciou na porta ${port}`);
  });
}

export default setup;
