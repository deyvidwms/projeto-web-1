const express = require('express');
const app = express();
const port = 3000;

const novaPontuacao = (nome, pontos) => ({ nome, pontos });

const MAXIMO_PONTUACOES = 10;
let pontuacoes = [
  novaPontuacao('Deyvid', -1),
  novaPontuacao('Djavan', 10),
  novaPontuacao('Nathãn', 8),
  novaPontuacao('Wendy', 9),
];

app.get('/pontuacao', (_, res) => {
  res.send(pontuacoes);
});

const adicionarPontuacao = (pontuacao) => {
  pontuacoes.push(pontuacao);
  pontuacoes.sort((p1, p2) => { p1.pontos - p2.pontos })
  pontuacoes = pontuacoes.slice(0, MAXIMO_PONTUACOES);
}

const validarPostPontuacao = (query) => {
  const erros = [];

  if (query.nome == undefined) {
    erros.push('Nome não foi informado');
  }

  if (query.pontos == undefined) {
    erros.push('Pontos não foi informado');
  }

  return erros;
}

app.post('/pontuacao', (req, res) => {
  const erros = validarPostPontuacao(req.query);

  if (erros.length != 0) {
    res.status(400).send(erros);
    return;
  }

  const nome = req.query.nome;
  const pontos = req.query.pontos;
  const pontuacao = novaPontuacao(nome, parseInt(pontos));

  adicionarPontuacao(pontuacao);

  res.status(200).send(pontuacao);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
