# Requisitos Técnicos - E-commerce Grupo Éxito

## Objetivo General
Desarrollar una aplicación de comercio electrónico que permita a los usuarios navegar y comprar productos, incluyendo lista de productos, página de detalle, carrito de compras y página de pago ficticia.

## Stack Tecnológico

### Frontend Framework
- **Next.js 15** con App Router
- **React 18+**
- **TypeScript**

### Styling & UI
- **Tailwind CSS** para estilos
- **shadcn/ui** para componentes de UI
- Diseño responsive (mobile-first)

### State Management
- **Zustand** para estado global (carrito)
- **nuqs** para estados de URL y filtros/búsquedas
- **TanStack Query** para manejo de datos del API

### Formularios & Tablas
- **TanStack Form** para formularios (página de pago)
- **TanStack Table** para tablas (si es necesario)

### Routing & Navigation
- **TanStack Router** (opcional, o usar App Router nativo de Next.js)

### API
- **Fake Store API**: `https://fakestoreapi.com/products`

## Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (shop)/            # Grupo de rutas de la tienda
│   │   ├── page.tsx       # Página de inicio
│   │   ├── product/       
│   │   │   └── [id]/
│   │   │       └── page.tsx # Detalle del producto
│   │   ├── cart/
│   │   │   └── page.tsx   # Carrito de compras
│   │   └── checkout/
│   │       └── page.tsx   # Página de pago
│   ├── layout.tsx         # Layout principal
│   └── globals.css
├── components/
│   ├── ui/                # Componentes shadcn/ui
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   ├── ProductDetail.tsx
│   │   └── ProductSearch.tsx
│   ├── cart/
│   │   ├── CartItem.tsx
│   │   ├── CartSummary.tsx
│   │   └── CartDrawer.tsx
│   └── checkout/
│       └── CheckoutForm.tsx
├── lib/
│   ├── api.ts             # Funciones API
│   ├── types.ts           # Tipos TypeScript
│   ├── utils.ts           # Utilidades
│   └── validations.ts     # Schemas de validación
├── hooks/
│   ├── useProducts.ts
│   ├── useCart.ts
│   └── useSearch.ts
└── store/
    └── cartStore.ts       # Store de Zustand para carrito
```

## Requisitos Funcionales Detallados

### 1. Header y Footer
**Componentes**: `Header.tsx`, `Footer.tsx`

**Header debe incluir**:
- Logo/nombre de la tienda
- Barra de búsqueda global
- Icono de carrito con contador de items
- Navegación principal
- Responsive menu para mobile

**Footer debe incluir**:
- Links de navegación
- Información de contacto
- Redes sociales
- Copyright

**Implementación**:
- Usar `layout.tsx` para incluir Header y Footer en todas las páginas
- Estado de búsqueda manejado con `nuqs`
- Contador de carrito desde `cartStore` (Zustand)

### 2. Página de Inicio
**Ruta**: `/`
**Componentes**: `ProductList.tsx`, `ProductCard.tsx`, `ProductSearch.tsx`

**Funcionalidades**:
- Mostrar grid de productos con imagen, nombre y precio
- Buscador para filtrar productos por nombre
- Botón "Agregar al carrito" en cada producto
- Filtros por categoría (opcional)
- Paginación o scroll infinito (opcional)

**Estados de URL con nuqs**:
- `?search=query` - Término de búsqueda
- `?category=electronics` - Filtro por categoría
- `?page=1` - Paginación

**API Integration**:
- `GET /products` - Obtener todos los productos
- `GET /products/categories` - Obtener categorías
- Usar TanStack Query para caching y loading states

### 3. Detalle del Producto
**Ruta**: `/product/[id]`
**Componentes**: `ProductDetail.tsx`

**Funcionalidades**:
- Mostrar imagen grande del producto
- Información completa: nombre, precio, descripción, categoría
- Rating y reviews (si está disponible en API)
- Selector de cantidad
- Botón "Agregar al carrito"
- Breadcrumbs para navegación

**API Integration**:
- `GET /products/{id}` - Obtener producto específico

### 4. Carrito de Compras
**Ruta**: `/cart`
**Componentes**: `CartItem.tsx`, `CartSummary.tsx`

**Funcionalidades**:
- Lista de productos agregados
- Controles para aumentar/disminuir cantidad
- Botón para eliminar productos
- Cálculo automático de subtotal y total
- Botón "Proceder al pago"
- Carrito vacío state

**Store (Zustand)**:
```typescript
interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}
```

### 5. Página de Pago (Opcional)
**Ruta**: `/checkout`
**Componentes**: `CheckoutForm.tsx`

**Funcionalidades**:
- Formulario con validación usando TanStack Form
- Campos requeridos:
  - Información personal (nombre, email, teléfono)
  - Dirección de envío
  - Información de tarjeta de crédito (ficticios)
- Resumen del pedido
- Confirmación de compra
- Página de éxito post-compra

**Nota**: Esta es una página de pago ficticia, no se requiere procesamiento real de pagos ni autenticación de usuarios.

**Validación**:
- Usar Zod para schemas de validación
- Validación en tiempo real
- Mensajes de error claros

## Configuraciones y Setup

### 1. Configuración de TanStack Query
```typescript
// app/providers.tsx
import { QueryClient, QueryProvider } from '@tanstack/react-query';
```

### 2. Configuración de nuqs
```typescript
// Para manejar estados de URL
import { useQueryState } from 'nuqs';
```

## APIs y Tipos

### Producto (de Fake Store API)
```typescript
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}
```

### Funciones API
```typescript
// lib/api.ts
export const api = {
  getProducts: () => fetch('/api/products').then(res => res.json()),
  getProduct: (id: string) => fetch(`/api/products/${id}`).then(res => res.json()),
  getCategories: () => fetch('/api/products/categories').then(res => res.json()),
};
```

## Testing (Opcional)
- **Jest** para pruebas unitarias
- **React Testing Library** para pruebas de componentes
- **Playwright** para pruebas E2E

## Despliegue
- **Vercel** (recomendado para Next.js)
- **Netlify** (alternativa)
- Configurar variables de entorno necesarias

## Criterios de Evaluación
- ✅ Estructura clara del proyecto
- ✅ Buenas prácticas de React/Next.js
- ✅ Manejo correcto del estado (Zustand)
- ✅ Implementación responsive
- ✅ Código TypeScript bien tipado
- ✅ Componentes reutilizables
- ✅ Manejo de errores y loading states
- ✅ UX/UI intuitiva
- ✅ Performance optimizada

## Entregables
1. Repositorio en GitHub con código fuente
2. Aplicación desplegada (Vercel/Netlify)
3. README con instrucciones de instalación y uso
4. Documentación de componentes principales

## Comandos de Desarrollo

```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Linting
npm run lint

# Testing
npm run test
```

## Dependencias Principales

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "zustand": "^4.0.0",
    "nuqs": "^1.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-form": "^0.0.0",
    "@tanstack/react-table": "^8.0.0",
    "zod": "^3.0.0",
    "lucide-react": "^0.0.0"
  }
}
```