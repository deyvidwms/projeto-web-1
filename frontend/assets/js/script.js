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

window.onload = () => {
  sessionStorage.removeItem('idCarta')
  criarCartas();
  showCurrentYear();

  sessionStorage.setItem('score', '0');

  const highscore = localStorage.getItem('highscore');
  if (highscore == null) {
    localStorage.setItem('highscore', '0');
  }
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

const criarNovaCarta = (idCarta, verso) => {
  return `<div class="card" data-index="${idCarta}" data-active="off" onClick="virarCarta(this)">
    <div class="card-inner">
      <div class="card-front">
        <p>? - ${idCarta}</p>
      </div>
      <div class="card-back">
        <p class="card-icon">${verso}</p>
      </div>
    </div>
  </div>`;
}

const criarCartas = () => {
  const cartas = sortearCartas(numeros);
  for (const carta of cartas) {
    const novaCarta = criarNovaCarta(carta['id'], carta['carta']);
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
  document.getElementsByClassName('success-message-mask')[0].classList.toggle("show");
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
