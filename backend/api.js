import * as fs from 'fs';

const MAXIMO_PONTUACOES = 10;
const CAMINHO_ARQUIVO_PONTUACOES = './pontuacoes.json';

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
  let pontuacoes = fs.readFileSync(CAMINHO_ARQUIVO_PONTUACOES, 'utf8');
  if (pontuacoes.length === 0) {
    pontuacoes = {
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
    }

    fs.writeFile(CAMINHO_ARQUIVO_PONTUACOES, JSON.stringify(pontuacoes), (err) => { if (err) { throw err; } });
  } else {
    pontuacoes = JSON.parse(pontuacoes);
  }

  console.log("pontos:", pontuacoes);
  return pontuacoes;
}

function novaPontuacaoTempo(nome, pontos, tempo) {
  return { nome, pontos, tempo };
}

function novaPontuacaoMovimentos(nome, pontos, movimentos) {
  return { nome, pontos, movimentos };
}

function funcaoOrdenarTempo(p1, p2) {
  const diferenca = p1.tempo - p2.tempo;
  if (diferenca === 0) {
    return p1.pontos - p2.pontos;
  }
  return diferenca;
}

function funcaoOrdenarMovimentos(p1, p2) {
  const diferenca = p1.movimentos - p2.movimentos;
  if (diferenca === 0) {
    return p1.pontos - p2.pontos;
  }
  return diferenca;
}

function adicionarPontuacao(pontuacao, dificuldade, modo) {
  let pontuacoes = carregarPontuacoesArquivo();

  pontuacoes[modo][dificuldade].push(pontuacao);
  const funcaoOrdenar = (modo === 'tempo') ? funcaoOrdenarTempo : funcaoOrdenarMovimentos;
  pontuacoes[modo][dificuldade].sort(funcaoOrdenar);
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
    res.send(carregarPontuacoesArquivo());
  });

  app.post('/pontuacao', (req, res) => {
    const erros = validarPostPontuacao(req.query);

    if (erros.length != 0) {
      res.status(400).send({ erros });
      return;
    }

    const { nome, pontos, tempo, movimentos, dificuldade } = req.query;

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
