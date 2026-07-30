// Importa o código CSS para estilizar o jogo
import './styles/game.css'

// Define as variáveis globais usadas no jogo
const naipes: string[] = ["copas", "espadas", "ouros", "paus"];
const valores: string[] = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];

// Cria uma interface (objeto) para representar uma carta, com os valores de naipe e valor (força da carta)
interface Carta {
    valor: string;
    naipe: string;
}

/**
    * Converte o nome do naipe em seu símbolo correspondente.
    * @param {string} naipe O nome do naipe.
    * @returns {string} O símbolo do naipe.
*/
function converterTextoNaipe(naipe: string): string {
    switch (naipe) {
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
    * @param {Carta} carta As informações da carta a ser criada.
    * @returns {HTMLDivElement} O elemento HTML da carta criada.
*/
function criarCarta(carta: Carta): HTMLDivElement {
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
                info.textContent = carta.valor; // Se o elemento tiver a classe 'card-number', define seu texto como o valor da carta
            } else {
                info.textContent = converterTextoNaipe(carta.naipe); // Se não, define seu texto como o símbolo do naipe da carta
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
const display: HTMLElement | null = document.getElementById('cards-display');
if (display) {
    for (let i = 0; i < 3; i++) {
        const carta: Carta = {
            valor: valores[Math.floor(Math.random() * valores.length)],
            naipe: naipes[Math.floor(Math.random() * naipes.length)]
        };
        const cartaElement = criarCarta(carta);
        display.appendChild(cartaElement);
    }
}