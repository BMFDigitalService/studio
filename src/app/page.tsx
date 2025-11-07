
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
import { placeholderImages } from "@/lib/placeholder-images";
import { Icons } from "@/components/icons";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-logistics');

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.forklift className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold tracking-tighter text-foreground">
                ALBINO
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="#services" className="text-foreground/80 hover:text-foreground">Serviços</a>
              <a href="#team" className="text-foreground/80 hover:text-foreground">Equipe</a>
              <a href="#contact" className="text-foreground/80 hover:text-foreground">Contato</a>
            </nav>
            <div className="flex items-center gap-4">
              {/* Botões movidos para a seção hero */}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16">
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
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
          <div className="relative z-10 p-4">
            <div className="flex flex-col items-center justify-center gap-4">
               <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">Contratar Serviços</Button>
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
                  <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white hover:text-black">Fazer Parte da Equipe</Button>
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
      
      <footer className="bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-secondary-foreground">
            <p>&copy; {new Date().getFullYear()} Albino Prestação de Serviços. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
}
