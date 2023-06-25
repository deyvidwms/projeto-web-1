const fs = require('fs');

const MAXIMO_PONTUACOES = 10;
const CAMINHO_ARQUIVO_PONTUACOES = './pontuacoes.dat';

function salvarPontuacoesArquivo(pontuacoes) {
  fs.writeFile(CAMINHO_ARQUIVO_PONTUACOES, JSON.stringify(pontuacoes), (err) => {
    if (err) {
      console.error('Erro ao salvar as pontuações:', err);
      return;
    }

    console.log('Pontuações salvas com sucesso!');
  });
}

function carregarPontuacoesArquivo() {
  fs.readFile(CAMINHO_ARQUIVO_PONTUACOES, { encoding: 'utf-8' }, (err, data) => {
    if (err) {
      console.error('Erro ao ler as pontuações:', err);
      return;
    }

    const pontuacoes = (data === null || data === undefined || data.length === 0) ? {
      'tempo': {
        'facil': [],
        'medio': [],
        'dificil': [],
      },
      'movimentos': {
        'facil': [],
        'medio': [],
        'dificil': [],
      }
    } : JSON.parse(data);

    console.log('Pontuações lidas com sucesso!');

    return pontuacoes;
  });
}

function novaPontuacaoTempo(nome, pontos, tempo) {
  return { nome, pontos, tempo };
}

function novaPontuacaoMovimentos(nome, pontos, movimentos) {
  return { nome, pontos, movimentos };
}

function adicionarPontuacao(pontuacao, dificuldade, modo) {
  let pontuacoes = carregarPontuacoesArquivo();

  pontuacoes[modo][dificuldade].push(pontuacao);
  pontuacoes[modo][dificuldade].sort((p1, p2) => { p1.pontos - p2.pontos });
  pontuacoes[modo][dificuldade] = pontuacoes[modo][dificuldade].slice(0, MAXIMO_PONTUACOES);

  salvarPontuacoesArquivo(pontuacoes);
}

function validarPostPontuacao(query) {
  const erros = [];

  if (query.nome === undefined) {
    erros.push('Nome não foi informado');
  }

  if (query.pontos === undefined) {
    erros.push('Pontos não foi informado');
  }

  if ((query.tempo === undefined && query.movimentos === undefined)
    || (query.tempo !== undefined && query.movimentos !== undefined)) {
    erros.push('É necessário informar ou o tempo ou o número de movimentos');
  }

  if (query.dificuldade === undefined) {
    erros.push('Dificuldade não foi informada');
  } else if (!['facil', 'medio', 'dificil'].includes(query.dificuldade)) {
    erros.push('Dificuldade inválida. Opções válidas: "facil" | "medio" | "dificil"');
  }

  return erros;
}

function setup(app, port) {
  app.get('/pontuacao', (_, res) => {
    res.send(pontuacoes);
  });

  app.post('/pontuacao', (req, res) => {
    const erros = validarPostPontuacao(req.query);

    if (erros.length != 0) {
      res.status(400).send({ erros });
      return;
    }

    const { nome, pontos } = req.query;
    const tempo = req.query.tempo;
    const movimentos = req.query.movimentos;
    const dificuldade = req.query.dificuldade;

    let pontuacao = {};
    let modo = ''
    if (movimentos !== undefined) {
      pontuacao = novaPontuacaoMovimentos(nome, parseInt(pontos), movimentos);
      modo = 'movimentos';
    } else {
      pontuacao = novaPontuacaoTempo(nome, parseInt(pontos), tempo);
      modo = 'tempo';
    }

    adicionarPontuacao(pontuacao, dificuldade, modo);

    res.status(200).send(pontuacao);
  });

  app.listen(port, () => {
    console.log(`Iniciou na porta ${port}`);
  });
}

export default setup;
