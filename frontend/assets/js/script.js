"use strict";

const API = "http://localhost:3000";

/**
 * 
 * Fácil - 10
 * Médio - 15
 * Difícil - 20
 * 
 */
const numeros = [...Array(10).keys()].map((i) => i.toString());
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😶', '😏', '😒', '🙄', '😬', '😮', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤'];
let cartasDoJogo = [];
var dificuldade = 10;


const sortear = () =>{
  const numerosSorteados = [];

  for(let i = 1; i <= 151; i++){
    numerosSorteados.push(i);
  }

  return embaralhar(numerosSorteados).slice(0, dificuldade);
}


const getEmoji = () => {
  const listaEmojis = embaralhar(emojis);
  //const randomIndex = Math.floor(Math.random() * emojis.length);
  return listaEmojis.slice(0, dificuldade);
}

const getPokemon = () => {
  return sortear();
}

const getYugioh = () => {
  
}



window.onload = () => {
  sessionStorage.removeItem('idCarta')
  //console.log(numeros);
  selecionarTema('emoji');
  //criarCartas(sortearCartas(cartasDoJogo));
  
  //criarCartasPokemons(sortearCartas(sortear()));
  showCurrentYear();

  sessionStorage.setItem('score', '0');

  const highscore = localStorage.getItem('highscore');
  if (highscore == null) {
    localStorage.setItem('highscore', '0');
  }
}


const selecionarTema = (temaSelecionado) => {
  if(temaSelecionado == 'emoji'){
    cartasDoJogo = [...getEmoji()];
    criarCartas(sortearCartas(cartasDoJogo));
  }
  else if(temaSelecionado == 'pokemon'){
    cartasDoJogo = [...getPokemon()];
  }
  else{
    cartasDoJogo = [...getYugioh()];
  }
  criarCartasPokemons(sortearCartas(cartasDoJogo));
}

const showCurrentYear = () => {
  const currentYear = getCurrentYear();
  document.getElementById('currentYear').innerText = currentYear;
}

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
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
  for (const carta of cartas) {
    const novaCarta = criarNovaCarta(
      carta['id'],
      `<p>Carta ${carta['id']}</p>`,
      `<p class="card-icon">${carta['carta']}</p>`);
    document.getElementById('cardLocations').innerHTML += novaCarta;
  }
}

const criarCartasPokemons = (cartas) =>{
  for(const carta of cartas ){
    const novaCarta = criarNovaCarta(
      carta['id'],
      `<p>Carta ${carta['id']}</p>`,
      `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${carta['carta']}.png" class="card-icon">`);
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

const virarCarta = (carta) => {
  const idCartaAtual = carta.getAttribute('data-index');

  if (carta.getAttribute('data-active') === 'on') {
    return;
  }

  carta.setAttribute('data-active', 'on');

  const idPrimeiraCarta = sessionStorage.getItem('idCarta');
  if (idPrimeiraCarta === null) {
    sessionStorage.setItem('idCarta', idCartaAtual);
    return;
  }

  const listaCartas = document.getElementById('cardLocations').children;

  if (idPrimeiraCarta !== idCartaAtual) {
    setTimeout(() => {
      desvirarCartas(listaCartas, [idPrimeiraCarta, idCartaAtual]);

      let score = Number(sessionStorage.getItem('score'));
      console.log(score);
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

    adicionarPontuacaoGlobal('Fulaninho', score);
    adicionarPontuacaoLocal('Fulaninho', score);

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

const adicionarPontuacaoGlobal = (nome, pontos) => {
  fetch(`${API}/pontuacao?nome=${nome}&pontos=${pontos}`, {
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

const adicionarPontuacaoLocal = (nome, pontos) => {
  const MAXIMO_PONTUACOES = 10;

  let pontuacoes = consultarPontuacoesLocais();
  pontuacoes.push({ nome, pontos });
  pontuacoes.sort((p1, p2) => { p1.pontos - p2.pontos })
  pontuacoes = pontuacoes.slice(0, MAXIMO_PONTUACOES);

  localStorage.setItem('pontuacoes', JSON.stringify(pontuacoes));
}
