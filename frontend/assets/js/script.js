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

const sortearCartas = (cartas) => {
  return embaralhar(duplicar(cartas.map((carta, i) => ({ carta, id: i }))));
}

const duplicar = (lista) => {
  return [...lista, ...lista];
}

const embaralhar = (lista) => {
  return lista.map(a => [a, Math.random()])
    .sort((a, b) => a[1] - b[1])
    .map(a => a[0]);
}

const virarCarta = (carta) => {
  const idCartaAtual = carta.getAttribute('data-index');
  const cartaJaVirada = carta.getAttribute('data-active') === 'on';
  if (cartaJaVirada) return;

  carta.setAttribute('data-active', 'on');

  const idPrimeiraCarta = sessionStorage.getItem('idCarta');
  if (idPrimeiraCarta === null) {
    sessionStorage.setItem('idCarta', idCartaAtual);
    return;
  }

  const listaCartas = document.getElementById('cardLocations').children;

  if (idPrimeiraCarta !== idCartaAtual) {
    setTimeout(() => {
      for (const elementoCarta of listaCartas) {
        if (idPrimeiraCarta === elementoCarta.getAttribute('data-index')) {
          elementoCarta.setAttribute('data-active', 'off');
        }
      }
      carta.setAttribute('data-active', 'off');
    }, 1000);
    sessionStorage.removeItem('idCarta');
    return;
  }

  // Aumentar pontuação
  for (let card of listaCartas) {
    if ([idCartaAtual, idPrimeiraCarta].includes(card.getAttribute('data-index'))) {
      card.setAttribute('class', 'card done');
      card.removeAttribute('data-active');
      card.removeAttribute('onClick');
      sessionStorage.removeItem('idCarta');
    }
  }

  for (let card of listaCartas) {
    if (card.getAttribute('data-active') === "off") {
      return;
    }
  }

  // Ganhou
  document.getElementsByClassName('success-message-mask')[0].setAttribute('class', 'success-message-mask show');
  document.getElementsByClassName('success-message')[0].setAttribute('class', 'success-message show');
}

const getNovaCarta = (idCarta, verso) => {
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
    const novaCarta = getNovaCarta(carta['id'], carta['carta']);
    document.getElementById('cardLocations').innerHTML += novaCarta;
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

  console.log(currentYear)
}

const getCurrentYear = () => {
	const date = new Date();
	return date.getFullYear();
}