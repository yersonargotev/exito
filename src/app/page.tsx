export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center md:p-16">
        <h1 className="mb-4 font-bold text-4xl tracking-tight md:text-6xl">
          Bienvenido a <span className="text-primary">Éxito Store</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Descubre los mejores productos con la calidad y servicio que te
          mereces. Tu satisfacción es nuestra prioridad.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Ver Productos
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-8 py-3 font-semibold hover:bg-muted"
          >
            Ofertas Especiales
          </button>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="mt-16">
        <h2 className="mb-8 text-center font-bold text-3xl">
          Categorías Destacadas
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="group cursor-pointer rounded-lg border border-border p-6 transition-colors hover:bg-muted">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">📱</span>
            </div>
            <h3 className="mb-2 font-semibold">Electrónicos</h3>
            <p className="text-muted-foreground text-sm">
              Smartphones, laptops y más
            </p>
          </div>
          <div className="group cursor-pointer rounded-lg border border-border p-6 transition-colors hover:bg-muted">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">👔</span>
            </div>
            <h3 className="mb-2 font-semibold">Ropa</h3>
            <p className="text-muted-foreground text-sm">
              Moda para hombre y mujer
            </p>
          </div>
          <div className="group cursor-pointer rounded-lg border border-border p-6 transition-colors hover:bg-muted">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">💍</span>
            </div>
            <h3 className="mb-2 font-semibold">Joyería</h3>
            <p className="text-muted-foreground text-sm">
              Anillos, collares y accesorios
            </p>
          </div>
          <div className="group cursor-pointer rounded-lg border border-border p-6 transition-colors hover:bg-muted">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-xl">🏠</span>
            </div>
            <h3 className="mb-2 font-semibold">Hogar</h3>
            <p className="text-muted-foreground text-sm">
              Decoración y accesorios
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-16">
        <h2 className="mb-8 text-center font-bold text-3xl">
          ¿Por qué elegir Éxito Store?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🚚</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Envío Gratis</h3>
            <p className="text-muted-foreground text-sm">
              Envío gratuito en compras superiores a $100.000
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Compra Segura</h3>
            <p className="text-muted-foreground text-sm">
              Tus datos y pagos están protegidos con la mejor tecnología
            </p>
          </div>
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
            <h3 className="mb-2 font-semibold">Garantía de Calidad</h3>
            <p className="text-muted-foreground text-sm">
              Productos originales con garantía del fabricante
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
