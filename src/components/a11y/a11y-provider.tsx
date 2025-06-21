'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface A11yPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  fontSize: 'small' | 'medium' | 'large';
  focusVisible: boolean;
}

interface A11yContextType {
  preferences: A11yPreferences;
  updatePreferences: (updates: Partial<A11yPreferences>) => void;
  announceToScreenReader: (message: string) => void;
}

const A11yContext = createContext<A11yContextType | undefined>(undefined);

export function useA11y() {
  const context = useContext(A11yContext);
  if (!context) {
    throw new Error('useA11y must be used within an A11yProvider');
  }
  return context;
}

interface A11yProviderProps {
  children: React.ReactNode;
}

export function A11yProvider({ children }: A11yProviderProps) {
  const [preferences, setPreferences] = useState<A11yPreferences>({
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    fontSize: 'medium',
    focusVisible: true,
  });

  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Detectar preferencias del sistema
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectPreferences = () => {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      const highContrast = window.matchMedia(
        '(prefers-contrast: high)',
      ).matches;
      const screenReader =
        window.navigator.userAgent.includes('NVDA') ||
        window.navigator.userAgent.includes('JAWS') ||
        window.navigator.userAgent.includes('VoiceOver');

      setPreferences((prev) => ({
        ...prev,
        reducedMotion,
        highContrast,
        screenReader,
      }));
    };

    detectPreferences();

    // Listeners para cambios en las preferencias del sistema
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');

    motionQuery.addEventListener('change', detectPreferences);
    contrastQuery.addEventListener('change', detectPreferences);

    return () => {
      motionQuery.removeEventListener('change', detectPreferences);
      contrastQuery.removeEventListener('change', detectPreferences);
    };
  }, []);

  // Aplicar clases CSS según las preferencias
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Aplicar clases de accesibilidad
    root.classList.toggle('reduce-motion', preferences.reducedMotion);
    root.classList.toggle('high-contrast', preferences.highContrast);
    root.classList.toggle('focus-visible', preferences.focusVisible);
    root.classList.toggle(`font-size-${preferences.fontSize}`, true);

    // Limpiar clases de tamaño de fuente
    ['small', 'medium', 'large'].forEach((size) => {
      if (size !== preferences.fontSize) {
        root.classList.remove(`font-size-${size}`);
      }
    });
  }, [preferences]);

  const updatePreferences = (updates: Partial<A11yPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));

    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'a11y-preferences',
        JSON.stringify({ ...preferences, ...updates }),
      );
    }
  };

  const announceToScreenReader = (message: string) => {
    setAnnouncements((prev) => [...prev, message]);

    // Limpiar anuncios después de un tiempo
    setTimeout(() => {
      setAnnouncements((prev) => prev.slice(1));
    }, 3000);
  };

  // Cargar preferencias guardadas
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('a11y-preferences');
    if (saved) {
      try {
        const parsedPreferences = JSON.parse(saved);
        setPreferences((prev) => ({ ...prev, ...parsedPreferences }));
      } catch (error) {
        console.error('Error loading accessibility preferences:', error);
      }
    }
  }, []);

  return (
    <A11yContext.Provider
      value={{
        preferences,
        updatePreferences,
        announceToScreenReader,
      }}
    >
      {children}

      {/* Región para anuncios a lectores de pantalla */}
      {announcements.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {announcements.map((announcement, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Index is stable for announcements
            <span key={index}>{announcement}</span>
          ))}
        </div>
      )}
    </A11yContext.Provider>
  );
}

// Hook para anunciar cambios importantes
export function useScreenReaderAnnouncement() {
  const { announceToScreenReader } = useA11y();

  return {
    announce: announceToScreenReader,
    announceCartUpdate: (
      itemName: string,
      action: 'added' | 'removed' | 'updated',
    ) => {
      const messages = {
        added: `${itemName} agregado al carrito`,
        removed: `${itemName} eliminado del carrito`,
        updated: `Cantidad de ${itemName} actualizada en el carrito`,
      };
      announceToScreenReader(messages[action]);
    },
    announcePageChange: (pageName: string) => {
      announceToScreenReader(`Navegando a ${pageName}`);
    },
    announceError: (error: string) => {
      announceToScreenReader(`Error: ${error}`);
    },
    announceSuccess: (message: string) => {
      announceToScreenReader(`Éxito: ${message}`);
    },
  };
}
