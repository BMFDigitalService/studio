import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TeamForm } from "@/components/team-form";
import { FormalContractForm } from "@/components/formal-contract-form";
import { MessageSquare, Phone, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Contratar Serviços
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <a href="https://wa.me/5511999998888" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <MessageSquare />
              <span>WhatsApp</span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <a href="tel:+5511999998888" className="flex items-center gap-2">
              <Phone />
              <span>Ligação</span>
            </a>
          </DropdownMenuItem>
          <Dialog>
            <DialogTrigger asChild>
                <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <FileText />
                    <span>Contrato Formal</span>
                </div>
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
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" variant="secondary">
            Fazer Parte da Equipe
          </Button>
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
  );
}
