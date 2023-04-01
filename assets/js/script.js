"use strict";

const numeros = [...Array(10).keys()].map((i) => i.toString());

const sortearCartas = (cartas) => {
    return embaralhar(duplicar(cartas));
}

const duplicar = (lista) => {
    return [...lista, ...lista];
}

const embaralhar = (lista) => {
    return lista.map(a => [a, Math.random()])
        .sort((a, b) => a[1] > b[1])
        .map(a => a[0]);
}

const virarCard = () => {
    const cartaJaVirada = true;
    if (cartaJaVirada) return;

    const idCartaAtual = '' // Obter um id único para cada carta

    const idPrimeiraCarta = sessionStorage.getItem('idCarta');
    const naoVirouOutraCarta = idCarta == undefined;
    if (naoVirouOutraCarta) {
        sessionStorage.setItem('idCarta', idCartaAtual);
        return;
    }

    if (idPrimeiraCarta == idCartaAtual) {
        // Detalhes de pontuação
    } else {
        // Desvirar as duas cartas
    }
}
