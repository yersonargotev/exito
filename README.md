# 🛒 Éxito Store - E-commerce Application

Una aplicación de comercio electrónico moderna desarrollada con **Next.js 15**, **React 19**, y **TypeScript**. Permite a los usuarios navegar productos, gestionar un carrito de compras y realizar compras ficticias.

## 🚀 Demo en Vivo

🔗 **[Ver aplicación desplegada](https://exito-nine.vercel.app/)**

## ✨ Características Principales

### 🏪 **Catálogo de Productos**
- **Lista de productos** con carga infinita (infinite scroll)
- **Búsqueda en tiempo real** con debounce
- **Filtros por categoría** dinámicos
- **Detalles de producto** con imágenes, descripción, precios y reviews
- **Estados de carga y error** optimizados

### 🛒 **Carrito de Compras**
- **Gestión completa del carrito** (agregar, eliminar, modificar cantidades)
- **Persistencia en localStorage** con hidratación segura
- **Cálculo automático** de totales y envío
- **Diseño responsive** mobile-first

### ❤️ **Sistema de Favoritos/Wishlist**
- **Lista de deseos persistente** con localStorage
- **Indicadores visuales** en productos y header
- **Página dedicada** para gestión de favoritos
- **Integración completa** con el catálogo

### ⚖️ **Comparación de Productos**
- **Comparar hasta 3 productos** lado a lado
- **Tabla comparativa detallada** con especificaciones
- **Gestión intuitiva** con límites automáticos
- **Persistencia de selección**

### ⭐ **Reviews y Calificaciones**
- **Sistema completo de reviews** con calificaciones por estrellas
- **Formulario para nuevas reviews** con validación
- **Resumen estadístico** de calificaciones
- **Filtros y ordenamiento** por utilidad y fecha
- **Integración en detalle de producto**

### 🔍 **Filtros Avanzados**
- **Filtros por rango de precio** con sliders
- **Filtros por calificación** de estrellas
- **Filtros por disponibilidad** y stock
- **Interfaz colapsible** para mejor organización

### 💳 **Proceso de Pago**
- **Checkout multi-step** con validación en tiempo real
- **Formularios avanzados** con TanStack Form + Zod
- **Detección automática** de tipo de tarjeta
- **Página de confirmación** con seguimiento ficticio

### 🎨 **Experiencia de Usuario**
- **Diseño responsive** para móvil, tablet y desktop
- **Tema claro/oscuro** con persistencia
- **Notificaciones toast** con Sonner
- **Skeletons y estados de carga** optimizados
- **SEO optimizado** con metadata dinámica

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[React 19](https://react.dev/)** - Biblioteca UI con React Compiler
- **[TypeScript](https://typescriptlang.org/)** - Tipado estático
- **[TailwindCSS](https://tailwindcss.com/)** - Framework CSS utilitario

### **Gestión de Estado**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Estado del carrito con persistencia
- **[TanStack Query](https://tanstack.com/query)** - Estado del servidor y cache
- **[TanStack Form](https://tanstack.com/form)** - Gestión avanzada de formularios

### **UI/UX**
- **[Radix UI](https://radix-ui.com/)** - Componentes primitivos accesibles
- **[Lucide React](https://lucide.dev/)** - Iconos SVG consistentes
- **[Sonner](https://sonner.emilkowal.ski/)** - Notificaciones toast elegantes
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Tema claro/oscuro

### **Validación y Schemas**
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript
- **[T3 Env](https://env.t3.gg/)** - Validación de variables de entorno

### **Testing**
- **[Jest](https://jestjs.io/)** - Framework de testing unitario
- **[Testing Library](https://testing-library.com/)** - Testing de componentes React
- **[Playwright](https://playwright.dev/)** - Testing end-to-end

### **Tooling**
- **[Biome](https://biomejs.dev/)** - Linter y formateador rápido
- **[PNPM](https://pnpm.io/)** - Gestor de paquetes eficiente

## 📦 Instalación y Uso

### **Prerrequisitos**
- **Node.js** 18.17 o superior
- **PNPM** 8.0 o superior

### **Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/yersonargotev/exito.git
cd exito
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno** (opcional)
```bash
cp .env.example .env
# Editar .env con tus valores si es necesario
```

4. **Ejecutar en desarrollo**
```bash
pnpm dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### **Scripts Disponibles**

```bash
# Desarrollo
pnpm dev          # Servidor de desarrollo con Turbo
pnpm build        # Build para producción
pnpm start        # Servidor de producción
pnpm preview      # Build + start

# Testing
pnpm test         # Tests unitarios
pnpm test:watch   # Tests en modo watch
pnpm test:coverage # Tests con cobertura
pnpm test:e2e     # Tests end-to-end
pnpm test:e2e:ui  # Tests E2E con interfaz

# Calidad de código
pnpm check        # Linter y formateo (check)
pnpm check:write  # Aplicar fixes automáticos
pnpm typecheck    # Verificación de tipos

# Performance
pnpm audit:performance  # Auditoría de rendimiento
pnpm lighthouse         # Análisis con Lighthouse
```

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (pages)/           # Páginas principales
│   │   ├── cart/          # Carrito de compras
│   │   ├── checkout/      # Proceso de pago
│   │   └── product/[id]/  # Detalle de producto
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página de inicio
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── cart/             # Componentes del carrito
│   ├── checkout/         # Componentes del checkout
│   ├── products/         # Componentes de productos
│   ├── layout/           # Header, Footer
│   └── providers/        # Context providers
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
│   ├── api.ts           # Cliente API
│   ├── types.ts         # Tipos TypeScript
│   └── utils.ts         # Funciones utilitarias
├── store/               # Estado global (Zustand)
└── styles/              # Estilos globales
```

## 🧪 Testing

El proyecto incluye testing completo:

### **Cobertura Actual**
- **104 tests** ejecutándose correctamente
- **7 test suites** con diferentes tipos de testing
- **Cobertura significativa** de componentes y lógica de negocio

### **Tipos de Tests**
- **Tests unitarios** - Componentes, hooks, servicios
- **Tests de integración** - Flujos completos del carrito
- **Tests E2E** - Casos de uso completos con Playwright

### **Ejecutar Tests**
```bash
# Todos los tests
pnpm test

# Con cobertura
pnpm test:coverage

# E2E tests
pnpm test:e2e
```

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- **📱 Mobile** (320px+)
- **📱 Tablet** (768px+) 
- **💻 Desktop** (1024px+)
- **🖥️ Large Desktop** (1280px+)

### **Características Responsive**
- **Mobile-first approach**
- **Menú hamburguesa** en móviles
- **Grid adaptativo** para productos
- **CTA fijo** en mobile para carrito
- **Formularios optimizados** para touch

## 🚀 Optimizaciones de Performance

### **Carga y Rendering**
- **Next.js Image** con formatos modernos (WebP, AVIF)
- **Lazy loading** de componentes pesados
- **Infinite scroll** optimizado con Intersection Observer
- **Memoización** estratégica (React.memo, useMemo, useCallback)

### **Estado y Cache**
- **TanStack Query** con cache inteligente
- **Zustand** con persistencia optimizada
- **Shallow comparison** para prevenir re-renders

### **Bundle y Build**
- **Bundle splitting** automático
- **Compresión gzip** habilitada
- **React Compiler** para optimizaciones automáticas
- **Tree shaking** de librerías no utilizadas

## 📊 Funcionalidades Implementadas

### ✅ **Requisitos Cumplidos**

#### **1. Header y Footer**
- ✅ Header siempre visible con navegación
- ✅ Footer con información y enlaces
- ✅ Responsive en todos los dispositivos

#### **2. Página de Inicio**
- ✅ Lista de productos con imágenes, nombres y precios
- ✅ Botón "Agregar al carrito" funcional
- ✅ Buscador con filtrado en tiempo real
- ✅ **BONUS:** Infinite scroll implementado
- ✅ **BONUS:** Filtros por categoría

#### **3. Detalle del Producto**
- ✅ Información completa: nombre, imagen, precio, descripción
- ✅ Categoría y ratings mostrados
- ✅ Botón "Agregar al carrito" funcional
- ✅ **BONUS:** Breadcrumb de navegación
- ✅ **BONUS:** Controles de cantidad

#### **4. Carrito de Compras**
- ✅ Lista de productos agregados
- ✅ Aumentar/disminuir cantidades
- ✅ Eliminar productos del carrito
- ✅ Total de la compra calculado
- ✅ **BONUS:** Cálculo de envío
- ✅ **BONUS:** Persistencia en localStorage

#### **5. Página de Pago (Opcional)**
- ✅ Formulario completo de información personal
- ✅ Formulario de dirección de envío
- ✅ Formulario de información de pago
- ✅ Confirmación de compra
- ✅ **BONUS:** Stepper visual
- ✅ **BONUS:** Validación en tiempo real

## 🌐 Deployment

### **Vercel (Recomendado)**

1. **Fork este repositorio**
2. **Conectar con Vercel**
   ```bash
   # O usar Vercel CLI
   pnpm i -g vercel
   vercel
   ```
3. **Deploy automático** en cada push a main

### **Otros Platforms**

La aplicación es compatible con:
- **Netlify**
- **Railway** 
- **AWS Amplify**
- **Google Cloud Run**

### **Variables de Entorno**

Para producción, configurar:
```bash
# Opcional - URL de API personalizada
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 🤝 Contribución

### **Setup para Desarrollo**

1. Fork el proyecto
2. Crear rama feature: `git checkout -b feature/amazing-feature`
3. Commit cambios: `git commit -m 'Add amazing feature'`
4. Push a la rama: `git push origin feature/amazing-feature`
5. Abrir Pull Request

### **Estándares de Código**

- **ESLint + Biome** para linting
- **TypeScript strict** mode
- **Conventional Commits**
- **Tests requeridos** para nuevas features

## 📄 Licencia

Este proyecto fue desarrollado como **prueba técnica** para **Grupo Éxito**.

## 👥 Equipo

Desarrollado por: **[Tu Nombre]**  
Email: **[tu.email@example.com]**  
LinkedIn: **[tu-linkedin]**  

---

## 🙏 Agradecimientos

- **Grupo Éxito** por la oportunidad
- **FakeStore API** por los datos de prueba
- **Vercel** por el hosting gratuito
- **Open Source Community** por las librerías utilizadas

---

⭐ **¡Dale una estrella si te gustó el proyecto!** 