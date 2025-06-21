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
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useCartTotals } from '@/hooks/use-cart';
import { useCategories } from '@/hooks/use-products';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Cart integration
  const { totalItems } = useCartTotals();

  // Categories integration
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Initialize search from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Handle search submission
  const handleSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();

      if (trimmedQuery) {
        // Navigate to home page with search params
        router.push(`/?search=${encodeURIComponent(trimmedQuery)}`);
      } else {
        // Clear search if empty
        router.push('/');
      }

      // Close mobile search on submit
      setIsSearchOpen(false);
    },
    [router],
  );

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Handle category selection
  const handleCategorySelect = useCallback(
    (category: string) => {
      router.push(`/?category=${encodeURIComponent(category)}`);
      setIsMobileMenuOpen(false);
    },
    [router],
  );

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    router.push('/');
  };

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
                  {categoriesLoading ? (
                    <div className="col-span-1 flex items-center justify-center p-4">
                      <LoadingSpinner size="sm" text="Cargando..." />
                    </div>
                  ) : (
                    categories?.map((category) => (
                      <NavigationMenuLink key={category} asChild>
                        <button
                          type="button"
                          onClick={() => handleCategorySelect(category)}
                          className="block select-none space-y-1 rounded-md p-3 text-left leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className='font-medium text-sm capitalize leading-none'>
                            {category === 'electronics' && 'Electrónicos'}
                            {category === "men's clothing" && 'Ropa de Hombre'}
                            {category === "women's clothing" && 'Ropa de Mujer'}
                            {category === 'jewelery' && 'Joyería'}
                            {![
                              'electronics',
                              "men's clothing",
                              "women's clothing",
                              'jewelery',
                            ].includes(category) && category}
                          </div>
                          <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                            {category === 'electronics' &&
                              'Smartphones, laptops, tablets y más'}
                            {category === "men's clothing" &&
                              'Moda masculina y accesorios'}
                            {category === "women's clothing" &&
                              'Moda femenina y accesorios'}
                            {category === 'jewelery' &&
                              'Anillos, collares y accesorios'}
                            {![
                              'electronics',
                              "men's clothing",
                              "women's clothing",
                              'jewelery',
                            ].includes(category) &&
                              'Productos de esta categoría'}
                          </p>
                        </button>
                      </NavigationMenuLink>
                    ))
                  )}
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
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pr-10 pl-10'
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
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
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="-top-2 -right-2 absolute flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {totalItems > 99 ? '99+' : totalItems}
                </Badge>
              )}
              <span className="sr-only">
                Carrito de compras ({totalItems}{' '}
                {totalItems === 1 ? 'artículo' : 'artículos'})
              </span>
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
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className='pr-10 pl-10'
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="-translate-y-1/2 absolute top-1/2 right-3 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
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
                  {categoriesLoading && (
                    <LoadingSpinner size="sm" className="ml-2" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/">Todas las categorías</Link>
                </DropdownMenuItem>
                {categories?.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <button
                      type="button"
                      onClick={() => handleCategorySelect(category)}
                      className="w-full text-left capitalize"
                    >
                      {category === 'electronics' && 'Electrónicos'}
                      {category === "men's clothing" && 'Ropa de Hombre'}
                      {category === "women's clothing" && 'Ropa de Mujer'}
                      {category === 'jewelery' && 'Joyería'}
                      {![
                        'electronics',
                        "men's clothing",
                        "women's clothing",
                        'jewelery',
                      ].includes(category) && category}
                    </button>
                  </DropdownMenuItem>
                ))}
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
