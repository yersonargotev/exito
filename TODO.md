# TODO - Prueba Técnica Grupo Éxito

## 📋 Resumen del Proyecto
Desarrollar una aplicación de e-commerce con React/Next.js que incluya lista de productos, detalle de producto, carrito de compras y página de pago ficticia.

## 🔧 Setup Inicial

### ✅ Configuración Base (Ya completado)
- [x] Configurar Next.js con TypeScript
- [x] Configurar TailwindCSS
- [x] Configurar TanStack Query
- [x] Configurar TanStack Form
- [x] Configurar Zustand para estado global
- [x] Configurar Lucide React para iconos

### 🔄 Configuración Pendiente
- [ ] Configurar tipos TypeScript para la API de FakeStore
- [ ] Configurar cliente HTTP para consumir la API
- [ ] Configurar variables de entorno si es necesario

## 🏗️ Estructura y Layout

### Header y Footer
- [ ] Crear componente `Header`
  - [ ] Logo/marca de la tienda
  - [ ] Navegación principal
  - [ ] Buscador de productos
  - [ ] Indicador de carrito con cantidad de items
  - [ ] Hacer responsive
- [ ] Crear componente `Footer`
  - [ ] Información de contacto
  - [ ] Links útiles
  - [ ] Hacer responsive
- [ ] Integrar Header y Footer en layout principal

## 🛍️ Gestión de Estado

### Store del Carrito (Zustand)
- [ ] Crear store de carrito con Zustand
  - [ ] Estado: items del carrito, cantidad total, precio total
  - [ ] Acciones: agregar item, remover item, aumentar cantidad, disminuir cantidad, limpiar carrito
  - [ ] Persistencia en localStorage
- [ ] Crear tipos TypeScript para el carrito
- [ ] Crear hooks personalizados para usar el store

## 🌐 Servicios API

### Cliente API
- [ ] Crear servicio para consumir FakeStore API
  - [ ] Función para obtener todos los productos
  - [ ] Función para obtener producto por ID
  - [ ] Función para obtener categorías
  - [ ] Función para buscar productos
- [ ] Configurar TanStack Query hooks
  - [ ] Hook para lista de productos
  - [ ] Hook para detalle de producto
  - [ ] Hook para búsqueda
- [ ] Crear tipos TypeScript para los datos de la API
- [ ] Manejo de estados de carga y error

## 📄 Páginas Principales

### 1. Página de Inicio (`/`)
- [ ] Crear layout de la página principal
- [ ] Implementar lista de productos
  - [ ] Grid responsive de productos
  - [ ] Card de producto con imagen, nombre, precio
  - [ ] Botón "Agregar al carrito" en cada card
- [ ] Implementar buscador de productos
  - [ ] Input de búsqueda en header
  - [ ] Filtrado en tiempo real
  - [ ] Manejo de estado de búsqueda con nuqs
- [ ] Implementar states de carga y error
- [ ] Paginación o scroll infinito (opcional)

### 2. Página de Detalle de Producto (`/product/[id]`)
- [ ] Crear página dinámica para detalle de producto
- [ ] Layout de detalle del producto
  - [ ] Imagen principal del producto
  - [ ] Nombre del producto
  - [ ] Precio
  - [ ] Descripción completa
  - [ ] Categoría
  - [ ] Rating y reviews
- [ ] Botón "Agregar al carrito" prominente
- [ ] Breadcrumb de navegación
- [ ] Manejo de estados de carga y error
- [ ] Botón "Volver" a la lista

### 3. Página de Carrito (`/cart`)
- [ ] Crear página del carrito de compras
- [ ] Lista de productos en el carrito
  - [ ] Card de producto con imagen, nombre, precio
  - [ ] Controles de cantidad (+/-)
  - [ ] Botón eliminar producto
  - [ ] Subtotal por producto
- [ ] Resumen del carrito
  - [ ] Total de items
  - [ ] Precio total
  - [ ] Botón "Proceder al pago"
- [ ] Estado vacío del carrito
- [ ] Validaciones de cantidad mínima/máxima

### 4. Página de Pago (`/checkout`) - Opcional
- [ ] Crear página de checkout
- [ ] Formulario de información personal (TanStack Form)
  - [ ] Nombre completo
  - [ ] Email
  - [ ] Teléfono
- [ ] Formulario de dirección de envío
  - [ ] Dirección
  - [ ] Ciudad
  - [ ] Código postal
- [ ] Formulario de información de pago
  - [ ] Número de tarjeta (ficticio)
  - [ ] Fecha de expiración
  - [ ] CVV
  - [ ] Nombre en la tarjeta
- [ ] Resumen del pedido
- [ ] Validaciones de formulario con Zod
- [ ] Página de confirmación de compra

## 🎨 Componentes UI

### Componentes Base
- [ ] Crear componente `ProductCard`
- [ ] Crear componente `CartItem`
- [ ] Crear componente `SearchInput`
- [ ] Crear componente `QuantitySelector`
- [ ] Crear componente `PriceDisplay`
- [ ] Crear componente `LoadingSpinner`
- [ ] Crear componente `ErrorMessage`

### Componentes de Layout
- [ ] Crear componente `Container` para ancho máximo
- [ ] Crear componente `Section` para secciones
- [ ] Crear componente `Breadcrumb`

## 📱 Responsive Design
- [ ] Asegurar que todas las páginas sean responsive
- [ ] Probar en dispositivos móviles, tablets y desktop
- [ ] Optimizar imágenes para diferentes tamaños de pantalla
- [ ] Menú hamburguesa para móviles

## 🧪 Testing
- [ ] Configurar testing framework (Jest + Testing Library)
- [ ] Tests unitarios para:
  - [ ] Store de carrito (Zustand)
  - [ ] Componentes principales
  - [ ] Hooks personalizados
  - [ ] Servicios API
- [ ] Tests de integración para flujos principales
- [ ] Tests end-to-end (opcional)

## 🚀 Optimizaciones y Performance
- [ ] Optimización de imágenes (Next.js Image)
- [ ] Lazy loading de componentes
- [ ] Memoización donde sea necesario
- [ ] SEO básico (meta tags, títulos)
- [ ] Lighthouse audit y optimizaciones

## 📋 Validaciones Finales
- [ ] Verificar todos los requisitos funcionales
- [ ] Probar todos los flujos de usuario
- [ ] Verificar responsive design
- [ ] Revisar código y refactoring
- [ ] Documentación (README actualizado)

## 🌐 Deployment
- [ ] Configurar deployment en Vercel/Netlify
- [ ] Configurar variables de entorno de producción
- [ ] Probar la aplicación en producción
- [ ] Documentar el link de la aplicación

## 📝 Entrega
- [ ] Subir código a GitHub/GitLab
- [ ] Crear README con instrucciones de instalación y uso
- [ ] Documentar decisiones técnicas importantes
- [ ] Proporcionar link de la aplicación desplegada

---

## 🔄 Orden de Desarrollo Recomendado

1. **Setup y Configuración**: Tipos, servicios API, store de carrito
2. **Layout Base**: Header, Footer, componentes base
3. **Página Principal**: Lista de productos con búsqueda
4. **Carrito**: Funcionalidad completa del carrito
5. **Detalle de Producto**: Página individual de producto
6. **Checkout**: Página de pago (opcional)
7. **Testing y Optimizaciones**: Pruebas y performance
8. **Deployment**: Subir a producción

---

## 📊 Tecnologías Utilizadas
- **Frontend**: Next.js 15, React 19, TypeScript
- **Estado**: Zustand (carrito), TanStack Query (servidor)
- **Formularios**: TanStack Form + Zod
- **Estilos**: TailwindCSS
- **Iconos**: Lucide React
- **API**: FakeStore API
- **Deployment**: Vercel (recomendado) 