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
import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="#contato">
          Contratar Serviços <MoveRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" variant="secondary">
            Fazer Parte da Equipe
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Fazer Parte da Equipe</DialogTitle>
            <DialogDescription>
              Preencha o formulário abaixo para se candidatar a uma vaga em nossa equipe.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TeamForm />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
