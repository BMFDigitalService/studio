
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TeamForm } from "@/components/team-form";
import { FormalContractForm } from "@/components/formal-contract-form";
import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/placeholder-images";
import { Icons } from "@/components/icons";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-logistics');

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image src="/image/logo.jpg" alt="Albino Logotipo" width={40} height={40} unoptimized />
              <Link href="/" className="flex flex-col items-center">
                <span className="text-xs font-light tracking-widest text-white/80">
                  CARGA/DESCARGA
                </span>
                <span className="text-4xl font-bold tracking-tighter text-white leading-none font-heading">
                  ALBINO
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#services" className="text-white/80 hover:text-white">Serviços</a>
              <a href="#team" className="text-white/80 hover:text-white">Equipe</a>
              <a href="#contact" className="text-white/80 hover:text-white">Contato</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-dvh flex items-center justify-center text-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 flex flex-col items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black min-w-[280px]">Contratar Serviços</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-lg p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Contrato Formal</DialogTitle>
                  <DialogDescription>
                    Preencha o formulário para um contato formal.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 px-1">
                  <FormalContractForm />
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black min-w-[280px]">Fazer Parte da Equipe</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Fazer Parte da Equipe</DialogTitle>
                  <DialogDescription>
                    Preencha o formulário abaixo para fazer parte da equipe.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <TeamForm />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Other sections can be added here */}

      </main>
      
      <footer className="bg-secondary py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary-foreground">
            <p>&copy; {new Date().getFullYear()} Albino Prestação de Serviços. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
}
