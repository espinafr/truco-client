import './styles/main.css'

const serverURL: string = import.meta.env.DEV
	? (import.meta.env.VITE_LOCAL_SERVER_URL ?? '')
	: (import.meta.env.VITE_PROD_SERVER_URL ?? '');


// Interface para definir funções de callback para eventos de ciclo de vida, como sucesso ou erro em operações assíncronas
export interface LifecycleHooks {
    onSuccess?: (...args: any[]) => void;
    onError?: (...args: any[]) => void;
}

// POST & GET

/**
 * Normaliza a URL do servidor.
 * @param route A rota a ser normalizada.
 * @returns A URL normalizada.
 */
function buildServerUrl(route?: string): string {
	const normalizedBase = serverURL.endsWith('/') ? serverURL.slice(0, -1) : serverURL; // Se o URL terminar com '/', remove ele

	if (!route || route.trim() === '') {
		return normalizedBase; // Se a rota não for fornecida ou for uma string vazia, retorna apenas a URL base do servidor
	}

	const normalizedRoute = route.startsWith('/') ? route : `/${route}`; // Normaliza a rota para garantir que ela comece com '/'
	return `${normalizedBase}${normalizedRoute}`;
}

/**
 * Lê o corpo da resposta de uma requisição HTTP.
 * @param response A resposta da requisição.
 * @returns O corpo da resposta.
 */
async function readResponseBody(response: Response): Promise<unknown> {
	const contentType = response.headers.get('content-type') ?? ''; // Pega o tipo do conteúdo da resposta, ou uma string vazia se não houver

	if (contentType.includes('application/json')) { // Se o tipo do conteúdo for JSON, lê e retorna o corpo como JSON
		return response.json();
	}

	return response.text(); // Se não for JSON, retorna o corpo como texto
}

/**
 * Realiza uma requisição GET.
 * @param route A rota da requisição.
 * @param init Opções de inicialização da requisição.
 * @returns A resposta da requisição.
 */
export async function getRequest<T = unknown>(route?: string, init: RequestInit = {}): Promise<T> {
	const response = await fetch(buildServerUrl(route), { // Constrói a URL completa da requisição
		...init, // Inclui as opções de inicialização fornecidas
		method: 'GET',
		headers: { // Define o cabeçalho da requisição para aceitar JSON, além de quaisquer cabeçalhos adicionais fornecidos
			Accept: 'application/json', 
			...(init.headers ?? {}),
		},
	});

	const body = await readResponseBody(response); // Lê o corpo da resposta

	if (!response.ok) { // Se a resposta não for bem-sucedida, lança um erro com informações sobre a falha
		throw new Error(`GET ${response.url} failed with status ${response.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
	}

	return body as T;
}

/**
 * Realiza uma requisição POST.
 * @param route A rota da requisição.
 * @param body O corpo da requisição.
 * @param init Opções de inicialização da requisição.
 * @returns A resposta da requisição.
 */
export async function postRequest<T = unknown, B = unknown>(route?: string, body?: B, init: RequestInit = {}): Promise<T> {
	// Verifica se o corpo da requisição é um objeto simples (não é FormData, Blob, URLSearchParams, ArrayBuffer ou uma view de ArrayBuffer)
    const isPlainObject = body !== null && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof URLSearchParams) && !(body instanceof ArrayBuffer) && !ArrayBuffer.isView(body);
	// Cria um objeto header (cabeçalho) a partir dos dados fornecidos ou cria um vazio
    const headers = new Headers(init.headers ?? {});

    // Se o corpo da requisição for um objeto simples e o cabeçalho não tiver 'Content-Type', define 'Content-Type' como 'application/json'
	if (isPlainObject && !headers.has('Content-Type')) {
		headers.set('Content-Type', 'application/json');
	}

	const response = await fetch(buildServerUrl(route), { // Constrói a URL completa da requisição
		...init, // Inclui as opções de inicialização fornecidas
		method: 'POST',
		headers, // Inclui os cabeçalhos definidos acima
		body: isPlainObject ? JSON.stringify(body) : (body as BodyInit | null | undefined), // Se o corpo for um objeto simples, converte para JSON; caso contrário, usa o corpo como está
	});

	// Lê o corpo da resposta
	const responseBody = await readResponseBody(response);

	if (!response.ok) {// Se a resposta não for bem-sucedida, lança um erro com informações sobre a falha
		throw new Error(`POST ${response.url} failed with status ${response.status}: ${typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody)}`);
	}

    // Devolve o corpo da resposta como o tipo genérico T, permitindo que o chamador especifique o tipo esperado da resposta
	return responseBody as T;
}

/**
 * Atualiza o status do servidor na interface do usuário.
 * @param isConnected Indica se o servidor está conectado.
 * @param ping O tempo de resposta do servidor, em milissegundos.
 */
export function updateServerStatus(isConnected: boolean, ping?: number): void {
    const pingContainer = document.getElementById('ping-container') as HTMLElement | null;
    if (!pingContainer) {
        return;
    }

    const text = pingContainer.querySelector('.status-servidor-text') as HTMLElement | null;
    const dot = pingContainer.querySelector('.status-servidor-ponto') as HTMLElement | null;

    if (text) {
        text.textContent = isConnected ? 'conectado' : 'desconectado';
    }

    if (dot) {
        dot.style.color = isConnected ? 'green' : 'red';
    }

    if (ping !== undefined) {
        const pingContainer = document.getElementById('ping-container') as HTMLElement | null;
        if (pingContainer) {
            pingContainer.textContent = `• ${isConnected ? 'conectado' : 'desconectado'} - Ping: ${ping}ms`;
        }
    }
}

/**
 * Tenta estabelecer uma conexão com o servidor e atualiza o status na interface do usuário.
 * @param hooks Um objeto contendo callbacks opcionais para sucesso e erro.
 */
export async function fireConnectionWidget(hooks?: LifecycleHooks): Promise<void> {
    try {
        await getRequest('/health');
        updateServerStatus(true);

        hooks?.onSuccess?.();
    } catch (error) {
        updateServerStatus(false);
        console.error('Erro ao chamar a API:', error);

        hooks?.onError?.();
    }
}

/**
 * Configura a tentativa de reconexão ao servidor
 */
export function setupReconnectButton(): void {
    const reconnectButton = document.getElementById('reconnect-button') as HTMLButtonElement | null;
    if (reconnectButton) {
        reconnectButton.addEventListener('click', async () => {
            reconnectButton.textContent = '⏳';
            reconnectButton.disabled = true;

            await fireConnectionWidget({
                onSuccess: () => {
                    console.log('Reconexão bem-sucedida.');
                },
                onError: () => {
                    console.error('Falha na reconexão.');
                }
            });

            reconnectButton.textContent = '🔄';
            reconnectButton.disabled = false;
        });
    } else {
        throw new Error('Botão de reconexão não encontrado no DOM.');
    }
}

/* Exemplo de uso das requisições genéricas com rotas mock.

export async function exampleApiUsage(): Promise<void> {
	try {
		const health = await getRequest<{ status: string }>('/teste');
		console.log('GET /health:', health);

		const createdUser = await postRequest<{ id: string; ok: boolean }, { name: string }>('/mock/users', {
			name: 'João',
		});
		console.log('POST /mock/users:', createdUser);
	} catch (error) {
		console.error('Erro ao chamar a API:', error);
	}
}
*/

// Webhooks

export interface DefaultPayload {
    type: string;
    message: any;
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
