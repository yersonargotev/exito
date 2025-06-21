'use client';

import { useEffect, useState } from 'react';

interface SkipLinkProps {
  links: Array<{
    href: string;
    label: string;
  }>;
  className?: string;
}

export function SkipLinks({ links, className }: SkipLinkProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Mostrar skip links cuando el usuario presiona Tab
      if (event.key === 'Tab') {
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      // Ocultar skip links cuando pierden el foco
      setTimeout(() => {
        if (!document.activeElement?.closest('.skip-links')) {
          setIsVisible(false);
        }
      }, 100);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusout', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return (
    <nav
      className={`skip-links fixed top-4 left-4 z-[9999] ${className ?? ''}`}
      aria-label="Enlaces de acceso rápido"
    >
      <ul className="flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`transform rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-all duration-200 focus:translate-y-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-foreground focus:ring-offset-2 focus:ring-offset-primary ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}hover:bg-primary/90`}
              onFocus={() => setIsVisible(true)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Skip links predeterminados para la aplicación
export const defaultSkipLinks = [
  { href: '#main-content', label: 'Ir al contenido principal' },
  { href: '#navigation', label: 'Ir a la navegación' },
  { href: '#search', label: 'Ir al buscador' },
  { href: '#cart', label: 'Ir al carrito' },
  { href: '#footer', label: 'Ir al pie de página' },
];
