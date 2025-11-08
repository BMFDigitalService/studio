
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
      
      <main className="flex-grow">
        <section className="relative h-dvh flex items-center justify-center text-center">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-contain"
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="text-6xl font-heading tracking-wider text-white">
                ALBINO
              </span>
              <span className="text-xs font-light tracking-widest text-white/80 -mt-1">
                CARGA/DESCARGA
              </span>
            </div>

            <div className="flex flex-col items-center gap-4">
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
          </div>
        </section>

        {/* Other sections can be added here */}

      </main>
      
      <footer className="bg-secondary py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-secondary-foreground">
            <p>Copyright© 3dabliu. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
}
