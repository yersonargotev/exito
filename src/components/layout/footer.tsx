import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-lg text-primary-foreground">
                É
              </div>
              <span className="font-bold text-foreground text-xl">
                Éxito Store
              </span>
            </div>
            <p className="mb-6 max-w-md text-muted-foreground leading-relaxed">
              Tu tienda online de confianza en Colombia. Encuentra los mejores
              productos con la calidad y servicio que te mereces. Envío gratis
              en compras superiores a $150.000 COP.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/exito"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                aria-label="Síguenos en Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/exito"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                aria-label="Síguenos en Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/exito"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                aria-label="Síguenos en Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Enlaces Rápidos
            </h3>
            <nav className="space-y-3">
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Inicio
              </Link>
              <Link
                href="/cart"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Carrito
              </Link>
              <Link
                href="/checkout"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Checkout
              </Link>
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Ofertas Especiales
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">
              Servicio al Cliente
            </h3>
            <nav className="space-y-3">
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Centro de Ayuda
              </Link>
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Información de Envíos
              </Link>
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Devoluciones
              </Link>
              <Link
                href="/"
                className="block text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Garantías
              </Link>
            </nav>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12 border-t pt-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Dirección</p>
                <p className="text-muted-foreground text-sm">
                  Calle Falsa 123, Medellín, Colombia
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Teléfono</p>
                <p className="text-muted-foreground text-sm">
                  +57 300 123 4567
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">Email</p>
                <p className="text-muted-foreground text-sm">
                  contacto@exito.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Éxito Store. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/"
                className="text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/"
                className="text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Términos de Servicio
              </Link>
              <Link
                href="/"
                className="text-muted-foreground text-sm transition-colors hover:text-primary"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
