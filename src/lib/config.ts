import { env } from '@/env';

export const API_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',

  // Configuración para determinar si usar datos locales o API remota
  // Por defecto: desarrollo = local, producción = remoto
  // Se puede forzar con la variable de entorno NEXT_PUBLIC_USE_LOCAL_DATA
  USE_LOCAL_DATA: env.NEXT_PUBLIC_USE_LOCAL_DATA
    ? env.NEXT_PUBLIC_USE_LOCAL_DATA === 'true'
    : process.env.NODE_ENV === 'development',

  // Configuración de timeouts y delays
  TIMEOUTS: {
    LOCAL_DELAY: 200, // Delay para simular latencia en datos locales
    PAGINATED_DELAY: 300, // Delay para paginación
  },

  // Configuración de paginación
  PAGINATION: {
    DEFAULT_LIMIT: 8,
  },

  // Configuración de búsqueda
  SEARCH: {
    MIN_QUERY_LENGTH: 2,
  },
} as const;
