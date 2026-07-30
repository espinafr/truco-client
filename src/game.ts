import './styles/game.css'

const naipes: string[] = ["copas", "espadas", "ouros", "paus"];
const valores: string[] = ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"];
interface Carta {
    valor: string;
    naipe: string;
}

const carta: Carta = {
    valor: valores[Math.floor(Math.random() * valores.length)],
    naipe: naipes[Math.floor(Math.random() * naipes.length)]
}
console.log(carta);