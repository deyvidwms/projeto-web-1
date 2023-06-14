"use strict";

const API = "http://localhost:3000";

/**
 * 
 * Fácil - 10
 * Médio - 15
 * Difícil - 20
 * 
 */
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶', '😏', '😒', '🙄', '😬', '😮', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤'];
let cartasDoJogo = [];
let dificuldade = 10;
let minutos = 0;
let segundos = 0;
let cronometro = undefined;
let movimentos = 0;


window.onload = () => {
  sessionStorage.removeItem('idCarta');
  sessionStorage.removeItem('temaSelecionado');
  sessionStorage.removeItem('dificuldadeSelecionada');

  sessionStorage.setItem('score', '0');

  document.getElementById("moves").innerHTML = 0;

  const highscore = localStorage.getItem('highscore');
  if (highscore == null) {
    localStorage.setItem('highscore', '0');
  }
}

const novoJogo = () => {
  const elmInitRank = document.getElementsByClassName('init-rank')[0];
  slideUp(elmInitRank, 500);

  setTimeout(() => {
    elmInitRank.setAttribute('class', 'tabs init-rank');

    setTimeout(() => {
      const elmOptionsGame = document.getElementsByClassName('options-game')[0];
      slideDown(elmOptionsGame, 500);
      setTimeout(() => { elmOptionsGame.setAttribute('tabs options-game active') }, 500)
    }, 500);
  }, 500);
}

const selecionarTema = (element) => {
  const themeOptions = document.getElementsByClassName('theme-option');

  for (let themeOption of themeOptions) {
    themeOption.setAttribute('class', 'theme-option');
  }

  element.setAttribute('class', 'theme-option active')

  sessionStorage.setItem('temaSelecionado', element.getAttribute('data-type'))

  slideUp(document.getElementById('error-theme'), 500);
}

const selecionarDificuldade = (element) => {
  const difficultyOptions = document.getElementsByClassName('difficulty-option');

  for (let difficultyOption of difficultyOptions) {
    difficultyOption.setAttribute('class', 'difficulty-option');
  }

  element.setAttribute('class', 'difficulty-option active')

  sessionStorage.setItem('dificuldadeSelecionada', element.getAttribute('data-type'))

  slideUp(document.getElementById('error-difficulty'), 500);
}

const iniciarJogo = () => {
  const temaSelecionado = sessionStorage.getItem('temaSelecionado') || null;
  const dificuldadeSelecionada = sessionStorage.getItem('dificuldadeSelecionada') || null;

  if (temaSelecionado != null && dificuldadeSelecionada != null) {
    if ( dificuldade === 'facil') {
      dificuldade = 10;
    } else if ( dificuldade === 'medio' ) {
      dificuldade = 15;
    } else if ( dificuldade === 'dificil' ) {
      dificuldade = 20;
    }
      
    if (temaSelecionado === 'emoji') {
      cartasDoJogo = [...getEmoji()];
      criarCartas(sortearCartas(cartasDoJogo));
    } else if (temaSelecionado === 'pokemon') {
      cartasDoJogo = [...getPokemon()];
      criarCartasPokemons(sortearCartas(cartasDoJogo));
    } else if (temaSelecionado === 'animais') {
      cartasDoJogo = [...getAnimais()];
      criarCartasAnimais(sortearCartas(cartasDoJogo));
    }

    document.getElementsByClassName('container--init-game')[0].style.display = 'none';
  } else {
    if (temaSelecionado == null) {
      slideDown(document.getElementById('error-theme'), 500);
    }

    if (dificuldadeSelecionada == null) {
      slideDown(document.getElementById('error-difficulty'), 500);
    }
  }
}

const sortear = () => {
  const numerosSorteados = [];

  for (let i = 1; i <= 151; i++) {
    numerosSorteados.push(i);
  }

  return embaralhar(numerosSorteados).slice(0, dificuldade);
}

const getEmoji = () => {
  const listaEmojis = embaralhar(emojis);
  return listaEmojis.slice(0, dificuldade);
}

const getPokemon = () => {
  return sortear();
}

const getAnimais = () => {
  const quantidadeCartas = dificuldade;
  const cartas = [];
  for (let i = 1; i <= 42; i++) {
    cartas.push(i);
  }

  return embaralhar(cartas).slice(0, quantidadeCartas);
}

function iniciarCronometro() {
  cronometro = setInterval(function () {
    segundos++;
    if (segundos == 60) {
      segundos = 0;
      minutos++;
    }
    exibirTempo();
    if (minutos === 99 && segundos === 99) {
      clearInterval(cronometro);
    }
  }, 1000);
}

function exibirTempo() {
  var tempo = formatarTempo(minutos) + ":" + formatarTempo(segundos);
  document.getElementById("time").innerHTML = tempo;
}

function formatarTempo(valor) {
  return valor < 10 ? "0" + valor : valor;
}

const embaralhar = (lista) => {
  return lista.map(a => [a, Math.random()])
    .sort((a, b) => a[1] - b[1])
    .map(a => a[0]);
}

const duplicar = (lista) => {
  return [...lista, ...lista];
}

const sortearCartas = (cartas) => {
  return embaralhar(duplicar(cartas.map((carta, i) => ({ carta, id: i }))));
}

const criarNovaCarta = (idCarta, frente, verso) => {
  return `<div class="card" data-index="${idCarta}" data-active="off" onClick="virarCarta(this)">
    <div class="card-inner">
      <div class="card-front">
        ${frente}
      </div>
      <div class="card-back">
        <div class="card-back-inner">
          ${verso}
        </div>
      </div>
    </div>
  </div>`;
}

const criarCartas = (cartas) => {
  document.getElementById('cardLocations').innerHTML = '';
  for (const carta of cartas) {
    const novaCarta = criarNovaCarta(
      carta['id'],
      `<p>Carta ${carta['id']}</p>`,
      `<p class="card-icon">${carta['carta']}</p>`);
    document.getElementById('cardLocations').innerHTML += novaCarta;
  }
}

const criarCartasPokemons = (cartas) => {
  for (const carta of cartas) {
    const novaCarta = criarNovaCarta(
      carta['id'],
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" width="50%"></img>`,
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${carta['carta']}.png" class="card-icon"></img>`);
    document.getElementById('cardLocations').innerHTML += novaCarta;
  }
}

const criarCartasAnimais = (cartas) => {
  for (const carta of cartas) {
    const novaCarta = criarNovaCarta(
      carta['id'],
      `<img src="./assets/images/pata.png " alt="" width="50%">`,
      `<img src="./assets/images/doc/${carta['carta']}.png" alt="" class="card-icon" width="50%">`
    );
    document.getElementById('cardLocations').innerHTML += novaCarta;
  }
}


const desvirarCartas = (cartas, idsCartas) => {
  for (const carta of cartas) {
    if (idsCartas.includes(carta.getAttribute('data-index'))) {
      carta.setAttribute('data-active', 'off');
    }
  }
}

const definirCartaPronta = (carta) => {
  carta.setAttribute('class', 'card done');
  carta.removeAttribute('data-active');
  carta.removeAttribute('onClick');
  sessionStorage.removeItem('idCarta');
}

const todasCartasForamViradas = (cartas) => {
  for (const carta of cartas) {
    if (carta.getAttribute('data-active') === "off") {
      return false;
    }
  }
  return true;
}

const alternarVisualizacaoMensagemSucesso = () => {
  document.igetElementsByClassName('success-message-mask')[0].classList.toggle("show");
  document.getElementsByClassName('success-message')[0].classList.toggle("show");
}

const virarCartaParaCima = (carta) => { carta.setAttribute('data-active', 'on') };
const virouUmaCarta = () => { return sessionStorage.getItem('idCarta') !== null };

const virarCarta = (carta) => {
  if (cronometro === undefined) {
    iniciarCronometro();
  }

  const idCartaAtual = carta.getAttribute('data-index');

  const cartaEstaComFaceParaCima = carta.getAttribute('data-active') === 'on';
  if (cartaEstaComFaceParaCima) {
    return;
  }

  virarCartaParaCima(carta);

  if (!virouUmaCarta()) {
    sessionStorage.setItem('idCarta', idCartaAtual);
    return;
  }

  movimentos++;
  document.getElementById("moves").innerHTML = movimentos;

  const listaCartas = document.getElementById('cardLocations').children;

  const idPrimeiraCarta = sessionStorage.getItem('idCarta');
  if (idPrimeiraCarta !== idCartaAtual) {
    setTimeout(() => {
      desvirarCartas(listaCartas, [idPrimeiraCarta, idCartaAtual]);

      let score = Number(sessionStorage.getItem('score'));
      if (score > 0) {
        score -= 1;
      }
      sessionStorage.setItem('score', String(score));
      document.getElementById('score').innerText = score;
    }, 1000);
    sessionStorage.removeItem('idCarta');
    return;
  }

  for (let carta of listaCartas) {
    if ([idCartaAtual, idPrimeiraCarta].includes(carta.getAttribute('data-index'))) {
      definirCartaPronta(carta);
    }
  }

  let score = Number(sessionStorage.getItem('score'));
  score += 10;
  sessionStorage.setItem('score', String(score));
  document.getElementById('score').innerText = score;

  if (todasCartasForamViradas(listaCartas)) {
    const highscore = sessionStorage.getItem('highscore');
    const score = Number(localStorage.getItem('score'));
    if (highscore == null || score > Number(highscore)) {
      localStorage.setItem('highscore', score);
    }

    const tempo = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    adicionarPontuacaoGlobal('Fulaninho', score, tempo, movimentos);
    adicionarPontuacaoLocal('Fulaninho', score, tempo, movimentos);

    alternarVisualizacaoMensagemSucesso();
  }
}

const showMenuMobile = (element) => {
  const isShow = element.getAttribute('data-show');
  element.setAttribute('data-show', `${isShow === 'on' ? 'off' : 'on'}`)
  document.getElementsByClassName('header-options')[0].setAttribute('class', `header-options ${isShow === 'off' ? 'show' : ''}`);
}

const consultarPontuacoesGlobais = async () => {
  const res = await fetch(`${API}/pontuacao`, { mode: 'cors' });
  return await res.json();
}

const adicionarPontuacaoGlobal = (nome, pontos, tempo, movimentos) => {
  fetch(`${API}/pontuacao?nome=${nome}&pontos=${pontos}&tempo=${tempo}&movimentos=${movimentos}`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" }
  });
}

const consultarPontuacoesLocais = () => {
  const pontuacoesLocalStorage = localStorage.getItem('pontuacoes');

  if (pontuacoesLocalStorage === null) {
    return [];
  }

  return JSON.parse(pontuacoesLocalStorage);
}

const adicionarPontuacaoLocal = (nome, pontos, tempo, movimentos) => {
  const MAXIMO_PONTUACOES = 10;

  let pontuacoes = consultarPontuacoesLocais();
  pontuacoes.push({ nome, pontos, tempo, movimentos });
  pontuacoes.sort((p1, p2) => { p1.pontos - p2.pontos })
  pontuacoes = pontuacoes.slice(0, MAXIMO_PONTUACOES);

  localStorage.setItem('pontuacoes', JSON.stringify(pontuacoes));
}
