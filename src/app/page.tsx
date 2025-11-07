import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContactForm } from "@/components/contact-form";
import { Icons } from "@/components/icons";
import { placeholderImages } from "@/lib/placeholder-images";
import { Boxes, GitMerge, MoveRight, Users } from "lucide-react";

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === "hero-logistics");
  const aboutImage = placeholderImages.find(p => p.id === "logistics-team");

  return (
    <div className="flex flex-col">
      <section id="inicio" className="relative h-[80vh] min-h-[500px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground px-4">
          <div className="max-w-4xl animate-fade-in-up">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Sua carga tratada com eficiência e segurança.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-primary-foreground/90 md:text-xl">
              Na Albino, otimizamos sua operação logística com equipes especializadas em carga e descarga. Terceirize com quem entende do seu negócio.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="#contato">
                  Contratar Serviços <MoveRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#equipe">Fazer Parte da Equipe</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Sobre a Albino</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Credibilidade e Experiência em Logística</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Com anos de experiência no mercado, a Albino se consolidou como uma parceira de confiança para empresas que buscam otimizar seus processos de carga e descarga. Nossos valores são a base do nosso trabalho: agilidade, segurança e compromisso com os resultados dos nossos clientes.
              </p>
            </div>
            <div className="animate-in fade-in-right duration-700">
              {aboutImage && (
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  data-ai-hint={aboutImage.imageHint}
                  width={600}
                  height={400}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <section id="servicos" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Nossos Serviços</div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">Soluções Completas para sua Logística</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Oferecemos soluções flexíveis e personalizadas para atender às necessidades específicas da sua operação, garantindo mais produtividade e redução de custos.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
            <Card className="animate-in fade-in duration-500">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-3">
                  <Icons.forklift className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="font-headline">Terceirização de Carga e Descarga</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Serviço completo de carga e descarga para caminhões, contêineres e armazéns. Agilidade e segurança para sua mercadoria.</p>
              </CardContent>
            </Card>
            <Card className="animate-in fade-in duration-700">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-3">
                  <Users className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="font-headline">Equipes Especializadas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profissionais treinados e qualificados para manusear diferentes tipos de carga, equipados para otimizar o tempo e garantir a integridade dos produtos.</p>
              </CardContent>
            </Card>
            <Card className="animate-in fade-in duration-900">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-full bg-primary p-3">
                  <GitMerge className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="font-headline">Flexibilidade Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Atendimento personalizado com equipes disponíveis sob demanda, 24/7. Adaptamos nossa escala para picos de trabalho e necessidades sazonais.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="equipe" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl/tight">Faça Parte da Nossa Equipe</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Procuramos profissionais dedicados e proativos para se juntarem ao time Albino. Se você tem experiência em logística e busca uma oportunidade de crescimento, queremos conhecer você.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link href="mailto:rh@albino-logistics.com.br?subject=Vaga para Equipe de Logística">
                Envie seu Currículo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="contato" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
        <div className="container grid items-center gap-8 px-4 md:px-6 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Contato</div>
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Peça um Orçamento</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Descubra como podemos reduzir custos e aumentar a produtividade da sua empresa. Preencha o formulário e nossa equipe entrará em contato em breve.
            </p>
            <div className="space-y-2 text-lg">
                <p><strong>Email:</strong> contato@albino-logistics.com.br</p>
                <p><strong>Telefone:</strong> (11) 99999-8888</p>
            </div>
          </div>
          <div className="w-full max-w-md">
            <Card>
              <CardContent className="p-6">
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
