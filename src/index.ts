import { WebSocketClient, fireConnectionWidget, type DefaultPayload, setupReconnectButton } from "./main.ts";

// Cria uma interface para representar uma sala
interface RoomInfo {
    name: string;
    players: number;
    type: string;
    id: number;
}

/**
 * Adiciona uma nova sala à lista de salas.
 * @param {RoomInfo} info Lista de RoomInfo.
 * @returns {HTMLDivElement} O elemento HTML da nova sala.
 */
function addNewRoom(info: RoomInfo): HTMLDivElement {
    // Seleciona o template do HTML
    const template = document.getElementById('template-room') as HTMLTemplateElement | null;

    // Verifica se o template existe antes de tentar clonar e manipular seu conteúdo
    if (!template) {
        console.error('Template de sala não encontrado no DOM.');
        throw new Error('Template de sala não encontrado no DOM.'); // Lança um erro se o template não for encontrado
    };

    // Clona o conteúdo do template para criar uma nova sala
    const replica = template.content.cloneNode(true) as HTMLElement;
  
    // Atualiza o conteúdo do template com os valores fornecidos
    replica.querySelectorAll('.room-info').forEach(infoElement => { // Seleciona todos os elementos com a classe 'room-info' dentro da réplica da carta
        if (infoElement instanceof HTMLElement) { // Verifica se o elemento é um HTMLElement antes de tentar acessar suas propriedades
            let dataType: string | null = infoElement.getAttribute('data-type'); // Obtém o valor do atributo data-type do elemento, que indica qual informação da sala deve ser exibida
            if (dataType && dataType in info) { // Checa se o atributo data-type existe e se é uma chave válida do objeto info
                infoElement.textContent = String(info[dataType as keyof RoomInfo]); // Define o texto do elemento como o valor correspondente armazenado na variável info, que é do tipo RoomInfo
            }
        }
    });

    // Cria um container adiciona a réplica a ele
    const container = document.createElement('div') as HTMLDivElement;
    container.className = 'game';
    container.appendChild(replica);

    return container; // Retorna o elemento
}

/**
 * Atualiza a lista de salas exibida na interface do usuário.
 * @param rooms Lista de salas a serem exibidas.
 */
function updateRoomList(rooms: RoomInfo[]): void {
    const gameroom = document.getElementById('gameroom') as HTMLDivElement | null;
    if (!gameroom) {
        console.error('Lista de salas não encontrada no DOM.');
        return;
    }

    gameroom.innerHTML = ''; // Limpa a lista antes de atualizar

    if (rooms.length == 0) { // Checa a quantidade se a quantidade de salas disponíveis é 0
        const emptyMessage = document.getElementById('template-gameroom-empty') as HTMLTemplateElement | null; // Copia o template de "não há salas abertas"
        if (emptyMessage) { // Se o template existir, clona o conteúdo e adiciona à lista de salas
            const replica = emptyMessage.content.cloneNode(true) as HTMLElement; // Clona o conteúdo do template
            gameroom.appendChild(replica); // Adiciona a réplica à lista de salas
        }
    } else { // Se houver salas disponíveis, cria elementos para cada sala e adiciona à lista
        rooms.forEach(room => { // Para cada sala disponível...
            const roomElement = addNewRoom(room); // Cria um elemento para a sala
            gameroom.appendChild(roomElement); // Adiciona o elemento à lista de salas
        });
    }
}

const roomFinder = new WebSocketClient(
    "ws://localhost:8000/game/rooms", 
    (payload: DefaultPayload) => {
        if (payload.type === "rooms_list") {
            const rooms = payload.message as RoomInfo[];
            updateRoomList(rooms);
        }
    }
);

document.addEventListener('DOMContentLoaded', async () => {
    await fireConnectionWidget({
        onSuccess: () => {
            roomFinder.connect();
        },
        onError: () => {
            updateRoomList([]);
        }
    });
    
    setupReconnectButton();
});