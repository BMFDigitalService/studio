import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-4">
      <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
        <Link href="#contato">
          Contratar Serviços <MoveRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
      <Button asChild size="lg" variant="secondary">
        <Link href="#equipe">Fazer Parte da Equipe</Link>
      </Button>
    </div>
  );
}
