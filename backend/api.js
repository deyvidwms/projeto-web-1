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

  return pontuacoes;
}

function novaPontuacao(nome, pontos, movimentos, tempo) {
  return { nome, pontos, movimentos, tempo };
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

function adicionarPontuacao(pontuacao, dificuldade) {
  let pontuacoes = carregarPontuacoesArquivo();

  pontuacoes['movimentos'][dificuldade].push(pontuacao);
  pontuacoes['movimentos'][dificuldade].sort(funcaoOrdenarMovimentos);
  pontuacoes['movimentos'][dificuldade] = pontuacoes['movimentos'][dificuldade].slice(0, MAXIMO_PONTUACOES);

  pontuacoes['tempo'][dificuldade].push(pontuacao);
  pontuacoes['tempo'][dificuldade].sort(funcaoOrdenarTempo);
  pontuacoes['tempo'][dificuldade] = pontuacoes['tempo'][dificuldade].slice(0, MAXIMO_PONTUACOES);

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

  if (query.movimentos === undefined) {
    erros.push('Movimentos não foi informado');
  }

  if (query.tempo === undefined) {
    erros.push('Tempo não foi informado');
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

    const pontuacao = novaPontuacao(nome, parseInt(pontos), movimentos, tempo);
    adicionarPontuacao(pontuacao, dificuldade);

    res.status(200).send(pontuacao);
  });

  app.listen(port, () => {
    console.log(`Iniciou na porta ${port}`);
  });
}

export default setup;
