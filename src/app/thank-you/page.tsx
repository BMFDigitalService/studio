
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleScheduleVisit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    // para o seu backend ou serviço de agendamento.
    console.log('Visita agendada com os dados do formulário.');
    
    toast({
      title: 'Visita Agendada!',
      description: 'Sua visita foi agendada com sucesso. Entraremos em contato para confirmar.',
    });

    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md space-y-4">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Sucesso!
        </h1>
        <p className="text-lg text-muted-foreground">
          Um representante de nossa equipe irá até você para assinar o contrato presencialmente.
        </p>
        <div className="pt-4 flex flex-col items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Agendar Visita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agendar Visita</DialogTitle>
                <DialogDescription>
                  Preencha seu endereço para a visita de assinatura do contrato.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleScheduleVisit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      Cidade
                    </Label>
                    <Input id="city" placeholder="Sua cidade" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="neighborhood" className="text-right">
                      Bairro
                    </Label>
                    <Input id="neighborhood" placeholder="Seu bairro" className="col-span-3" required />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zip" className="text-right">
                      CEP
                    </Label>
                    <Input id="zip" placeholder="00000-000" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="street" className="text-right">
                      Rua
                    </Label>
                    <Input id="street" placeholder="Nome da rua" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="number" className="text-right">
                      Número
                    </Label>
                    <Input id="number" placeholder="Nº" className="col-span-3" required />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Agendar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  );
}
