
'use client';

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const addressSchema = z.object({
  city: z.string().min(1, 'A cidade é obrigatória.'),
  neighborhood: z.string().min(1, 'O bairro é obrigatório.'),
  zip: z.string().min(1, 'O CEP é obrigatório.'),
  street: z.string().min(1, 'A rua é obrigatória.'),
  number: z.string().min(1, 'O número é obrigatório.'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function ThankYouPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasContractData, setHasContractData] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem('contractData');
        if (!data) {
            toast({
                variant: 'destructive',
                title: 'Acesso Inválido',
                description: 'Você precisa gerar um contrato antes de agendar uma visita.',
            });
            router.push('/');
        } else {
            setHasContractData(true);
        }
    }
  }, [router, toast]);


  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: '',
      neighborhood: '',
      zip: '',
      street: '',
      number: '',
    },
  });

  const handleScheduleVisit: SubmitHandler<AddressFormData> = (addressData) => {
    setIsSubmitting(true);
    try {
      const contractDataString = localStorage.getItem('contractData');
      if (!contractDataString) {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: 'Não foi possível encontrar os dados do contrato. Por favor, preencha o formulário novamente.',
        });
        setIsSubmitting(false);
        return;
      }

      const contractData = JSON.parse(contractDataString);

      const servicesText = contractData.servicesDetails.map((s: any) => 
        `- ${s.service}: ${s.quantity} (Subtotal: ${s.subtotal})`
      ).join('\n');

      const message = `
Olá, gostaria de agendar uma visita para assinatura de contrato.

*DADOS DA EMPRESA:*
- *Empresa:* ${contractData.companyName}
- *CNPJ:* ${contractData.cnpj}
- *Responsável:* ${contractData.responsibleName}
- *Localização da Empresa:* ${contractData.companyLocation}

*DETALHES DO CONTRATO:*
- *Período:* ${contractData.startDate} a ${contractData.endDate}
- *Serviços Contratados:*
${servicesText}
- *CUSTO TOTAL:* ${contractData.totalCost}

*ENDEREÇO PARA VISITA:*
- *Cidade:* ${addressData.city}
- *Bairro:* ${addressData.neighborhood}
- *CEP:* ${addressData.zip}
- *Rua:* ${addressData.street}, Nº ${addressData.number}

Aguardo a confirmação. Obrigado!
      `.trim().replace(/^\s+/gm, '');
      
      const encodedText = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5547997292357?text=${encodedText}`;
      
      window.open(whatsappUrl, '_blank');
      
      localStorage.removeItem('contractData');
      form.reset();
      
      // Optionally redirect to a final confirmation page or back to home
      // router.push('/');

    } catch (error) {
      console.error('Erro ao gerar link do WhatsApp:', error);
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Ocorreu um problema ao gerar a mensagem. Tente novamente.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasContractData) {
      return (
          <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full space-y-6 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Quase lá!
        </h1>
        <p className="text-lg text-muted-foreground">
          Seu contrato foi gerado. Agora, preencha seu endereço para agendarmos a visita de assinatura.
        </p>
        
        <div className="text-left bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-center">Agendar Visita</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleScheduleVisit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Nº" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-6">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Gerando Mensagem...
                    </>
                  ) : (
                    "Agendar e Enviar via WhatsApp"
                  )}
                </Button>
              </form>
            </Form>
        </div>
      </div>
    </div>
  );
}
