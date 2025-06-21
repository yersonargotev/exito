import type { Metadata } from 'next';

export const generateOfflineMetadata = (): Metadata => ({
    title: 'Sin conexión - Éxito Store',
    description:
        'No tienes conexión a internet. Algunos productos pueden estar disponibles en tu caché local.',
    robots: {
        index: false,
        follow: false,
    },
});

export default function OfflinePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
            <div className="mx-auto max-w-md space-y-6">
                {/* Icono de offline */}
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <svg
                        className="h-12 w-12 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m0 0L18.364 5.636m0 0L5.636 18.364"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01"
                        />
                    </svg>
                </div>

                {/* Título */}
                <div className="space-y-2">
                    <h1 className="font-bold text-2xl text-foreground">
                        Sin conexión a internet
                    </h1>
                    <p className="text-muted-foreground">
                        Parece que no tienes conexión a internet. Algunos productos pueden
                        estar disponibles en tu caché local.
                    </p>
                </div>

                {/* Acciones */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Intentar de nuevo
                    </button>

                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="inline-flex w-full items-center justify-center rounded-md border border-border bg-background px-6 py-3 font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Volver atrás
                    </button>
                </div>

                {/* Status de conexión */}
                <div className="rounded-lg border border-border bg-card p-4">
                    <h3 className="mb-2 font-semibold text-foreground text-sm">
                        Estado de conexión
                    </h3>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-muted-foreground text-sm">Desconectado</span>
                    </div>
                </div>

                {/* Consejos */}
                <div className="rounded-lg border border-border bg-card p-4 text-left">
                    <h3 className="mb-2 font-semibold text-foreground text-sm">
                        Sugerencias:
                    </h3>
                    <ul className="space-y-1 text-muted-foreground text-sm">
                        <li>• Verifica tu conexión WiFi o datos móviles</li>
                        <li>• Intenta moverte a un área con mejor señal</li>
                        <li>• Revisa la configuración de red de tu dispositivo</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export const metadata = generateOfflineMetadata();
