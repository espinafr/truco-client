export const serverURL: string = import.meta.env.DEV
	? (import.meta.env.VITE_LOCAL_SERVER_URL ?? '')
	: (import.meta.env.VITE_PROD_SERVER_URL ?? '');