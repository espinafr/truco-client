import './styles/main.css'

const serverURL: string = import.meta.env.DEV
	? (import.meta.env.VITE_LOCAL_SERVER_URL ?? '')
	: (import.meta.env.VITE_PROD_SERVER_URL ?? '');

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
 * Exemplo de uso das requisições genéricas com rotas mock.

export async function exampleApiUsage(): Promise<void> {
	try {
		const health = await getRequest<{ status: string }>('/health');
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        await getRequest<{ status: string }>('/health');
        updateServerStatus(true);
    } catch (error) {
		console.error('Erro ao chamar a API:', error);
        updateServerStatus(false);
	}
});
