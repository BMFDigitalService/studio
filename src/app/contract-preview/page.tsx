
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';

export default function ContractPreviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [contractText, setContractText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    try {
      const contractDataString = localStorage.getItem('contractData');
      if (contractDataString) {
        const contractData = JSON.parse(contractDataString);
        if (contractData.contractText) {
          setContractText(contractData.contractText);
        } else {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: 'Texto do contrato não encontrado. Por favor, gere o contrato novamente.',
          });
          router.push('/');
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro!',
          description: 'Dados do contrato não encontrados. Por favor, preencha o formulário novamente.',
        });
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao carregar dados do contrato:', error);
      toast({
        variant: 'destructive',
        title: 'Erro de Carregamento',
        description: 'Não foi possível carregar os dados do contrato. Tente novamente.',
      });
      router.push('/');
    }
  }, [router, toast]);

  const handleAgreeAndProceed = () => {
    setIsProcessing(true);
    try {
      // 1. Download PDF
      const doc = new jsPDF();
      const plainText = contractText
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
        .replace(/(\*|_)(.*?)\1/g, '$2')   // Italic
        .replace(/#{1,6}\s/g, '');        // Headers
      const splitText = doc.splitTextToSize(plainText, 180);
      doc.text(splitText, 15, 20);
      doc.save('contrato_prestacao_servicos.pdf');

      // 2. Navigate to next page
      router.push('/thank-you');

    } catch (error) {
      console.error("Erro ao processar:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um problema ao baixar o PDF ou navegar. Por favor, tente novamente.",
      });
      setIsProcessing(false);
    }
    // No need to set isProcessing back to false if navigation is successful
  };

  const formattedContractText = contractText
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // Bold
    .replace(/(\*|_)(.*?)\1/g, '$2')   // Italic
    .replace(/#{1,6}\s/g, '');        // Headers

  if (!contractText) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Carregando contrato...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-secondary p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Pré-visualização do Contrato</CardTitle>
              <CardDescription>Revise o contrato de serviço gerado abaixo.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] rounded-md border bg-background p-4">
            <div className="whitespace-pre-wrap font-sans text-sm">{formattedContractText}</div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end">
           <Button onClick={handleAgreeAndProceed} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              "Concordar"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
