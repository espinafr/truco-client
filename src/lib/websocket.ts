import { serverURL } from "../config/env";

export interface DefaultPayload {
    type: string;
    message: any;
}

/**
 * Normaliza a URL do servidor Websocket.
 * @param route A rota a ser normalizada.
 * @returns A URL normalizada.
 */
export function buildWebsocketServerUrl(route?: string): string {
    const normalizedBase = serverURL.endsWith('/') ? serverURL.slice(0, -1) : serverURL; // Se o URL terminar com '/', remove ele
    
    let normalizedProtocol: string;
    if (normalizedBase.startsWith('http://')) {
        normalizedProtocol = normalizedBase.replace('http://', 'ws://'); // Substitui 'http://' por 'ws://'
    } else if (normalizedBase.startsWith('https://')) {
        normalizedProtocol = normalizedBase.replace('https://', 'wss://'); // Substitui 'https://' por 'wss://'
    } else {
        throw new Error(`URL do servidor inválida: ${normalizedBase}. Deve começar com 'http://' ou 'https://'`);
    }

	if (!route || route.trim() === '') {
		return normalizedBase; // Se a rota não for fornecida ou for uma string vazia, retorna apenas a URL base do servidor
	}

	const normalizedRoute = route.startsWith('/') ? route : `/${route}`; // Normaliza a rota para garantir que ela comece com '/'
	return `${normalizedProtocol}${normalizedRoute}`;
}

/** Classe para gerenciar a conexão WebSocket */ 
export class WebSocketClient {
    private ws: WebSocket | null = null; // Instância do WebSocket
    private url: string; // URL do servidor WebSocket
    private tries: number = 0; // Contador de tentativas de reconexão
    private onMessageCallback: (data: DefaultPayload) => void; // A função de callback que será chamada quando um payload for recebido

    constructor(url: string, onMessage: (data: DefaultPayload) => void) { // Construtor da classe, recebe a URL do servidor e a função de callback
        this.url = url;
        this.onMessageCallback = onMessage;
    }

    /**
     * Inicia a conexão WebSocket.
     */
    public connect(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) { // Verifica se já existe uma conexão aberta
            console.warn("Conexão WebSocket já esta aberta. Ignorando nova tentativa de conexão.");
            return;
        }
        this.tries++; // Incrementa o contador de tentativas
        this.ws = new WebSocket(this.url); // Cria uma nova instância do WebSocket com a URL fornecida

        this.ws.onopen = () => { // Avisa que a conexão foi estabelecida
            this.tries = 0; // Reseta o contador de tentativas
            console.log("Conexão WebSocket estabelecida com sucesso."); 
        };

        this.ws.onmessage = (event: MessageEvent) => { // Função para lidar com os payloads recebidos do servidor
            try {
                const parsedData: DefaultPayload = JSON.parse(event.data); // Interpreta o payload recebido como JSON
                this.onMessageCallback(parsedData);
            } catch (error) {
                console.error("Não foi possível interpretar o payload do WebSocket:", error);
            }
        };

        this.ws.onerror = (error: Event) => { // Função para lidar com erros na conexão WebSocket
            console.error("Foi observado um erro no WebSocket:", error);
        };

        this.ws.onclose = (event: CloseEvent) => { // Função para lidar com o fechamento da conexão WebSocket
            if (this.tries < 5) { // Tenta reconectar até 5 vezes
                console.warn(`Conexão WebSocket fechada. Código: ${event.code}. Tentando reconectar em 3 segundos...`);
                setTimeout(() => this.connect(), 3000); // Tenta reconectar após 3 segundos
            } else {
                console.error(`Conexão WebSocket fechada. Código: ${event.code}. Número máximo de tentativas de reconexão atingido.`);
            }
        };
    }

    /**
     * Envia um payload para o servidor WebSocket.
     * @param payload O payload a ser enviado.
     */
    public send(payload: DefaultPayload): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) { // Verifica se a conexão WebSocket está aberta antes de enviar o paylod
            this.ws.send(JSON.stringify(payload)); // Converte o payload para JSON e envia para o servidor
        } else {
            console.error("Não foi possível enviar. Conexão WebSocket não está aberta.");
        }
    }

    /**
     * Desconecta a conexão WebSocket.
     */
    public disconnect(): void {
        if (!this.ws) {
            console.warn("Não há uma conexão WebSocket ativa para desconectar.");
            return;
        } else {
            this.ws.close();
        }
    }
}
