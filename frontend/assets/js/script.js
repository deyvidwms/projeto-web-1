"use strict";

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
    }, 1000);
    sessionStorage.removeItem('idCarta');
    return;
  }

  // Aumentar pontuação
  for (let carta of listaCartas) {
    if ([idCartaAtual, idPrimeiraCarta].includes(carta.getAttribute('data-index'))) {
      definirCartaPronta(carta);
    }
  }

  if (todasCartasForamViradas(listaCartas)) {
    alternarVisualizacaoMensagemSucesso();
  }
}

const showMenuMobile = (element) => {
  const isShow = element.getAttribute('data-show');
  element.setAttribute('data-show', `${isShow === 'on' ? 'off' : 'on'}`)
  document.getElementsByClassName('header-options')[0].setAttribute('class', `header-options ${isShow === 'off' ? 'show' : ''}`);
}

const showCurrentYear = () => {
  const currentYear = getCurrentYear();
  document.getElementById('currentYear').innerText = currentYear;
}

const getCurrentYear = () => {
  const date = new Date();
  return date.getFullYear();
}
