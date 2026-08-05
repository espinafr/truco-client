// Importa o código CSS para estilizar o jogo
import { fireConnectionWidget, setupReconnectButton } from './main';
import './styles/game.css'

// Define as variáveis globais usadas no jogo
const suits: string[] = ["copas", "espadas", "ouros", "paus"];
const values: string[] = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];

// Cria uma interface para representar uma carta, com os valores de naipe e valor (força da carta)
interface Card {
    value: string;
    suit: string;
}

/**
    * Converte o nome do naipe em seu símbolo correspondente.
    * @param {string} suit O nome do naipe.
    * @returns {string} O símbolo do naipe.
*/
function convertSuitToSymbol(suit: string): string {
    switch (suit) {
        case "copas":
            return "♥";
        case "espadas":
            return "♠";
        case "ouros":
            return "♦";
        case "paus":
            return "♣";
        default:
            return "";
    }
}

/**
    * Cria uma carta no DOM com base nas informações fornecidas.
    * @param {Card} card As informações da carta a ser criada.
    * @returns {HTMLDivElement} O elemento HTML da carta criada.
*/
function createCard(card: Card): HTMLDivElement {
    // Seleciona o template do HTML
    const template = document.getElementById('template-card') as HTMLTemplateElement | null;

    // Verifica se o template existe antes de tentar clonar e manipular seu conteúdo
    if (!template) {
        console.error('Template de carta não encontrado no DOM.');
        throw new Error('Template de carta não encontrado no DOM.'); // Lança um erro se o template não for encontrado
    };

    // Clona o conteúdo do template para criar uma nova carta
    const replica = template.content.cloneNode(true) as HTMLElement;
  
    // Atualiza o conteúdo da carta com os valores fornecidos
    replica.querySelectorAll('.card-info').forEach(info => { // Seleciona todos os elementos com a classe 'card-info' dentro da réplica da carta
        if (info instanceof HTMLElement) { // Verifica se o elemento é um HTMLElement antes de tentar acessar suas propriedades
            if (info.classList.contains('card-number')) {
                info.textContent = card.value; // Se o elemento tiver a classe 'card-number', define seu texto como o valor da carta
            } else {
                info.textContent = convertSuitToSymbol(card.suit); // Se não, define seu texto como o símbolo do naipe da carta
            }
        }
    });
    
    // Cria um container adiciona a réplica da carta a ele
    const container = document.createElement('div') as HTMLDivElement;
    container.className = 'card-container';
    container.appendChild(replica);

    return container; // Retorna o elemento HTML da carta criada
}

// Testa a função
try {
    const display: HTMLElement | null = document.getElementById('cards-display');
    if (display) {
        for (let i = 0; i < 3; i++) {
            const card: Card = {
                value: values[Math.floor(Math.random() * values.length)],
                suit: suits[Math.floor(Math.random() * suits.length)]
            };
            const cardElement = createCard(card);
            display.appendChild(cardElement);
        }
    }
} catch (error) {
    console.error('Erro ao criar cartas:', error);
}

document.addEventListener('DOMContentLoaded', async () => {
    await fireConnectionWidget();
    setupReconnectButton();
});