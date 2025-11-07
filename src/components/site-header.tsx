
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isScrolled ? "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Truck className={cn("h-6 w-6", isScrolled ? "text-primary" : "text-white")} />
          <span className={cn(
            "font-bold font-headline",
            isScrolled ? "text-primary" : "text-white"
          )}>
            Albino Logistics
          </span>
        </Link>
        
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
          <Link href="#sobre" className={cn("transition-colors hover:text-primary", isScrolled ? "text-muted-foreground" : "text-gray-300 hover:text-white")}>Sobre</Link>
          <Link href="#servicos" className={cn("transition-colors hover:text-primary", isScrolled ? "text-muted-foreground" : "text-gray-300 hover:text-white")}>Serviços</Link>
          <Link href="#contato" className={cn("transition-colors hover:text-primary", isScrolled ? "text-muted-foreground" : "text-gray-300 hover:text-white")}>Contato</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild variant="ghost" className={cn("hidden md:inline-flex", isScrolled ? "" : "text-white hover:bg-white/10 hover:text-white")}>
            <Link href="#equipe">Fazer parte da equipe</Link>
          </Button>
          
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn(isScrolled ? "" : "text-white hover:bg-white/10 hover:text-white")}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col space-y-6 p-6">
                  <Link href="/" className="flex items-center space-x-2">
                    <Truck className="h-6 w-6 text-primary" />
                    <span className="font-bold font-headline text-primary">Albino Logistics</span>
                  </Link>
                  <nav className="flex flex-col space-y-4 text-lg">
                    <SheetClose asChild><NavLink href="#sobre">Sobre</NavLink></SheetClose>
                    <SheetClose asChild><NavLink href="#servicos">Serviços</NavLink></SheetClose>
                    <SheetClose asChild><NavLink href="#contato">Contato</NavLink></SheetClose>
                    <SheetClose asChild><NavLink href="#equipe">Fazer parte da equipe</NavLink></SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
