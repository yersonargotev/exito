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
    <footer className="border-border border-t bg-muted/50">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
                E
              </div>
              <span className="font-bold">Éxito Store</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Tu tienda online de confianza. Encuentra los mejores productos con
              la calidad y servicio que te mereces.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Inicio
              </Link>
              <Link
                href="/productos"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Productos
              </Link>
              <Link
                href="/ofertas"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Ofertas
              </Link>
              <Link
                href="/nosotros"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Nosotros
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold">Servicio al Cliente</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/ayuda"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Centro de Ayuda
              </Link>
              <Link
                href="/envios"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Información de Envíos
              </Link>
              <Link
                href="/devoluciones"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Devoluciones
              </Link>
              <Link
                href="/garantia"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Garantía
              </Link>
              <Link
                href="/contacto"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Contactanos
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-muted-foreground text-sm">
                    Carrera 7 #32-16
                    <br />
                    Bogotá, Colombia
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  +57 (1) 555-0123
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">
                  info@exito-store.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-border border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Éxito Store. Todos los derechos
              reservados.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacidad"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/terminos"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
              >
                Términos de Servicio
              </Link>
              <Link
                href="/cookies"
                className="text-muted-foreground text-sm transition-colors hover:text-foreground"
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
