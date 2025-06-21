'use client';

import { useEffect, useState } from 'react';

interface PWAInstallProps {
    className?: string;
}

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function PWAInstallPrompt({ className }: PWAInstallProps) {
    const [deferredPrompt, setDeferredPrompt] =
        useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Verificar si ya está instalado
        const isStandalone = window.matchMedia(
            '(display-mode: standalone)',
        ).matches;
        const isInWebAppiOS = (window.navigator as any).standalone === true;
        const isInWebAppChrome = window.matchMedia(
            '(display-mode: standalone)',
        ).matches;

        if (isStandalone || isInWebAppiOS || isInWebAppChrome) {
            setIsInstalled(true);
            return;
        }

        // Listener para el evento beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Mostrar el prompt después de que el usuario haya interactuado un poco
            setTimeout(() => {
                setShowInstallPrompt(true);
            }, 3000);
        };

        // Listener para cuando la app se instala
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            setDeferredPrompt(null);

            // Analytics event (opcional)
            try {
                if ('gtag' in window) {
                    (window as any).gtag('event', 'pwa_install', {
                        event_category: 'engagement',
                        event_label: 'PWA installed',
                    });
                }
            } catch (error) {
                console.log('Analytics not available:', error);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallPrompt,
            );
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Mostrar el prompt de instalación
        deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('Usuario aceptó instalar la PWA');
        } else {
            console.log('Usuario rechazó instalar la PWA');
        }

        // Limpiar el prompt
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);

        // No mostrar de nuevo por un tiempo
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    };

    // No mostrar si está instalado o ya fue rechazado recientemente
    useEffect(() => {
        const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
        if (dismissedTime) {
            const timeSinceDismissed = Date.now() - Number.parseInt(dismissedTime);
            const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 días en milisegundos

            if (timeSinceDismissed < oneWeek) {
                setShowInstallPrompt(false);
            }
        }
    }, []);

    if (isInstalled || !showInstallPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div
            className={`fixed right-4 bottom-4 left-4 z-50 max-w-sm rounded-lg border border-border bg-card p-4 shadow-lg md:right-4 md:left-auto ${className ?? ''}`}
            role="dialog"
            aria-labelledby="pwa-install-title"
            aria-describedby="pwa-install-description"
        >
            <div className="flex items-start gap-3">
                {/* Icono de la app */}
                <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                        <svg
                            className="h-6 w-6 text-primary-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <h3
                        id="pwa-install-title"
                        className="font-semibold text-foreground text-sm"
                    >
                        Instalar Éxito Store
                    </h3>
                    <p
                        id="pwa-install-description"
                        className="mt-1 text-muted-foreground text-sm"
                    >
                        Instala nuestra app para un acceso más rápido y funciones offline.
                    </p>

                    <div className="mt-3 flex gap-2">
                        <button
                            type="button"
                            onClick={handleInstallClick}
                            className="rounded bg-primary px-3 py-1.5 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Instalar
                        </button>
                        <button
                            type="button"
                            onClick={handleDismiss}
                            className="rounded border border-border bg-background px-3 py-1.5 font-medium text-foreground text-sm transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            Ahora no
                        </button>
                    </div>
                </div>

                {/* Botón de cerrar */}
                <button
                    type="button"
                    onClick={handleDismiss}
                    className="flex-shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Cerrar prompt de instalación"
                >
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
