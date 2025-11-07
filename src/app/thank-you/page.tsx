
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md space-y-4">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Contrato Gerado com Sucesso!
        </h1>
        <p className="text-lg text-muted-foreground">
          O seu contrato em PDF foi baixado. Agradecemos por utilizar nossos serviços.
        </p>
        <div className="pt-4">
          <Link href="/">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Voltar para a Página Inicial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
