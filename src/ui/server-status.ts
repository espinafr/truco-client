import { getRequest } from "../lib/https";

// Interface para definir funções de callback para eventos de ciclo de vida, como sucesso ou erro em operações assíncronas
export interface LifecycleHooks {
    onSuccess?: (...args: any[]) => void;
    onError?: (...args: any[]) => void;
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
        await getRequest('/health'); // Faz uma requisição GET para a rota '/health' do servidor para verificar se ele está ativo
        updateServerStatus(true); // Se o request não der erro, o código continua e ele atualiza o widget de status

        hooks?.onSuccess?.(); // Se houver um callback de sucesso definido, ele é chamado
    } catch (error) {
        updateServerStatus(false); // Se houver um erro na requisição, o widget de status é atualizado para indicar que o servidor está desconectado
        console.error('Erro ao chamar a API:', error); // Loga o erro no console para depuração

        hooks?.onError?.(); // Se houver um callback de erro definido, ele é chamado
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