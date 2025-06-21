'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Temporary cart count - this will be replaced with actual cart state
  const cartItemCount = 3;

  return (
    <header className="sticky top-0 z-50 w-full border-border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-primary-foreground">
              E
            </div>
            <span className="hidden font-bold sm:inline-block">
              Éxito Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categorías</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                  <div className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <div className="mt-4 mb-2 font-medium text-lg">
                          Todas las Categorías
                        </div>
                        <p className="text-muted-foreground text-sm leading-tight">
                          Explora nuestra amplia selección de productos
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/category/electronics"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="font-medium text-sm leading-none">
                        Electrónicos
                      </div>
                      <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                        Smartphones, laptops, tablets y más
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/category/clothing"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="font-medium text-sm leading-none">
                        Ropa
                      </div>
                      <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                        Moda para hombre y mujer
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/category/jewelery"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="font-medium text-sm leading-none">
                        Joyería
                      </div>
                      <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                        Anillos, collares y accesorios
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/ofertas" className={navigationMenuTriggerStyle()}>
                  Ofertas
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/nosotros" className={navigationMenuTriggerStyle()}>
                  Nosotros
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar - Desktop */}
        <div className="mx-8 hidden max-w-md flex-1 lg:flex">
          <div className="relative w-full">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Search Button - Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>

          {/* Cart Button */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
              <span className="sr-only">Carrito de compras</span>
            </Link>
          </Button>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Menú</span>
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="border-border border-t bg-background p-4 md:hidden">
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="border-border border-t bg-background p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start">
                  Categorías
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/category/electronics">Electrónicos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/clothing">Ropa</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/category/jewelery">Joyería</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/ofertas" className="block py-2 font-medium text-sm">
              Ofertas
            </Link>
            <Link href="/nosotros" className="block py-2 font-medium text-sm">
              Nosotros
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
