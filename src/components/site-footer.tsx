import Link from "next/link";
import { Truck, Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export function SiteFooter() {
  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Truck className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold font-headline text-primary">Albino Logistics</span>
            </Link>
            <p className="text-muted-foreground">
              Terceirize com quem entende do seu negócio. Resultados garantidos e flexibilidade total.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-semibold">Navegação</h4>
            <ul className="space-y-2">
              <li><Link href="#sobre" className="text-muted-foreground hover:text-primary">Sobre Nós</Link></li>
              <li><Link href="#servicos" className="text-muted-foreground hover:text-primary">Serviços</Link></li>
              <li><Link href="#contato" className="text-muted-foreground hover:text-primary">Contato</Link></li>
              <li><Link href="#equipe" className="text-muted-foreground hover:text-primary">Trabalhe Conosco</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-semibold">Contato</h4>
            <address className="not-italic space-y-2 text-muted-foreground">
              <p>Rua Exemplo, 123, São Paulo - SP</p>
              <a href="mailto:contato@albino-logistics.com.br" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4"/> contato@albino-logistics.com.br
              </a>
              <a href="tel:+5511999998888" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4"/> (11) 99999-8888
              </a>
            </address>
          </div>
          <div className="space-y-4">
            <h4 className="font-headline font-semibold">Siga-nos</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} aria-label={social.name}>
                  <social.icon className="h-6 w-6 text-muted-foreground hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container py-4 px-4 md:px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Albino Logistics. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
