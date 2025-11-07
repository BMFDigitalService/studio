"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useMemo } from "react";
import { format, differenceInCalendarDays, eachDayOfInterval, isSaturday, isSunday } from "date-fns";
import { ptBR } from "date-fns/locale";
import jsPDF from "jspdf";
import { Loader2, Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronDown, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { generateContract } from "@/ai/flows/generate-contract-flow";
import type { GenerateContractInput } from "@/ai/flows/contract-schemas";

const services = [
  { id: "carga", label: "Carga" },
  { id: "descarga", label: "Descarga" },
  { id: "transbordo", label: "Transbordo" },
  { id: "diaria", label: "Diária" },
] as const;

const servicePrices: Record<(typeof services)[number]["id"], number> = {
    carga: 600,
    descarga: 550,
    transbordo: 650,
    diaria: 220,
};

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "O nome da empresa deve ter pelo menos 2 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "O CNPJ deve ter 14 caracteres.",
  }),
  responsibleName: z.string().min(2, {
    message: "O nome do responsável deve ter pelo menos 2 caracteres.",
  }),
  startDate: z.date({
    required_error: "A data de início é obrigatória.",
  }),
  endDate: z.date({
    required_error: "A data final é obrigatória.",
  }),
  services: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você deve selecionar pelo menos um serviço.",
  }),
  quantityCarga: z.string().optional(),
  quantityDescarga: z.string().optional(),
  quantityTransbordo: z.string().optional(),
  numberOfCollaborators: z.string().optional(),
});

type ServiceId = (typeof services)[number]["id"];

const calculateBusinessDays = (start: Date, end: Date) => {
    if (!start || end < start) return 0;
    const dateInterval = eachDayOfInterval({ start, end });
    const businessDays = dateInterval.filter(day => !isSaturday(day) && !isSunday(day));
    return businessDays.length;
}

export function FormalContractForm() {
  const { toast } = useToast();
  const [openSelectors, setOpenSelectors] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      responsibleName: "",
      services: [],
      quantityCarga: "1",
      quantityDescarga: "1",
      quantityTransbordo: "1",
      numberOfCollaborators: "1",
    },
  });

  const watchedServices = form.watch("services");
  const watchedQuantities = form.watch([
    "quantityCarga",
    "quantityDescarga",
    "quantityTransbordo",
    "numberOfCollaborators",
  ]);
  const watchedStartDate = form.watch("startDate");
  const watchedEndDate = form.watch("endDate");

  const serviceQuantities: Record<ServiceId, number> = {
    carga: parseInt(watchedQuantities[0] || "0"),
    descarga: parseInt(watchedQuantities[1] || "0"),
    transbordo: parseInt(watchedQuantities[2] || "0"),
    diaria: parseInt(watchedQuantities[3] || "0"),
  };

  const totalCost = useMemo(() => {
    let total = 0;
    const startDate = form.getValues("startDate");
    const endDate = form.getValues("endDate");
    
    watchedServices.forEach((serviceId) => {
        const id = serviceId as ServiceId;
        const price = servicePrices[id];

        if (id === 'diaria') {
            if (startDate && endDate) {
                const days = calculateBusinessDays(startDate, endDate);
                const collaborators = serviceQuantities.diaria || 0;
                total += price * collaborators * days;
            }
        } else {
            const quantity = serviceQuantities[id] || 0;
            total += price * quantity;
        }
    });

    return total;
  }, [watchedServices, serviceQuantities, watchedStartDate, watchedEndDate, form]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsGenerating(true);
    try {
        const budget: GenerateContractInput = {
            ...data,
            startDate: format(data.startDate, "dd/MM/yyyy", { locale: ptBR }),
            endDate: format(data.endDate, "dd/MM/yyyy", { locale: ptBR }),
            totalCost: totalCost.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
            }),
            servicesDetails: data.services.map(serviceId => {
                const id = serviceId as ServiceId;
                const price = servicePrices[id];
                
                if (id === 'diaria') {
                    const collaborators = serviceQuantities.diaria;
                    const days = (data.startDate && data.endDate) ? calculateBusinessDays(data.startDate, data.endDate) : 0;
                    return {
                        service: services.find(s => s.id === id)?.label,
                        quantity: `${collaborators} colaborador(es) por ${days} dia(s) úteis`,
                        subtotal: (price * collaborators * days).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                    }
                }
                
                const quantity = serviceQuantities[id];
                return {
                    service: services.find(s => s.id === id)?.label,
                    quantity,
                    subtotal: (quantity * price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                }
            })
        };

        const result = await generateContract(budget);
        setGeneratedContract(result.contractText);
        setIsPreviewOpen(true);
        
        toast({
          title: "Contrato gerado com sucesso!",
          description: "Seu contrato está pronto para visualização.",
        });

    } catch (error) {
        console.error("Erro ao gerar contrato:", error);
        toast({
            variant: "destructive",
            title: "Erro ao gerar contrato",
            description: "Ocorreu um problema ao gerar o contrato. Por favor, tente novamente.",
        });
    } finally {
        setIsGenerating(false);
    }
  }

  const handleDownloadPdf = () => {
    if (!generatedContract) return;
    const doc = new jsPDF();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const text = doc.splitTextToSize(generatedContract.replace(/###|##|#/g, ''), 180);
    doc.text(text, 15, 20);
    doc.save("Contrato_de_Servicos.pdf");
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && generatedContract) {
        printWindow.document.write('<html><head><title>Contrato de Serviços</title>');
        printWindow.document.write('<style>body { font-family: sans-serif; white-space: pre-wrap; word-wrap: break-word; } h1, h2, h3 { margin-top: 1.5em; } ul { list-style-position: inside; padding-left: 0;} </style>');
        printWindow.document.write('</head><body>');
        // Simple markdown to HTML conversion
        const htmlContract = generatedContract
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
        printWindow.document.write(htmlContract);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
  };

  const getQuantityFieldName = (serviceId: ServiceId) => {
    switch (serviceId) {
      case "carga":
        return "quantityCarga";
      case "descarga":
        return "quantityDescarga";
      case "transbordo":
        return "quantityTransbordo";
      case "diaria":
        return "numberOfCollaborators";
    }
  };

  const getQuantityLabel = (serviceId: ServiceId) => {
    switch (serviceId) {
      case "carga":
        return "Quantidade de Cargas";
      case "descarga":
        return "Quantidade de Descargas";
      case "transbordo":
        return "Quantidade de Transbordos";
      case "diaria":
        return "Quantidade de Colaboradores";
    }
  };

  const toggleSelector = (serviceId: ServiceId) => {
    setOpenSelectors(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ScrollArea className="h-[60vh] md:h-auto">
              <div className="space-y-6 pr-4">
                  <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                          <Input placeholder="Nome da sua empresa" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>CNPJ</FormLabel>
                      <FormControl>
                          <Input placeholder="00.000.000/0000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="responsibleName"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Nome do Responsável</FormLabel>
                      <FormControl>
                          <Input placeholder="Nome do responsável pela contratação" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Início</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0,0,0,0))
                                }
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Prazo Final</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < (form.getValues("startDate") || new Date(new Date().setHours(0,0,0,0)))
                                }
                                initialFocus
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                      <FormItem>
                      <div className="mb-4">
                          <FormLabel>Tipo de Serviços</FormLabel>
                          <FormDescription>
                          Selecione os serviços que você precisa.
                          </FormDescription>
                      </div>
                      <div className="space-y-4">
                          {services.map((item) => {
                          const isSelected = watchedServices.includes(item.id);
                          const quantityFieldName = getQuantityFieldName(item.id);
                          const quantityValue = serviceQuantities[item.id];
                          const isSelectorOpen = openSelectors[item.id];

                          return (
                              <div key={item.id}>
                              <FormField
                                  control={form.control}
                                  name="services"
                                  render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                      <FormControl>
                                      <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                          const newValue = checked
                                              ? [...field.value, item.id]
                                              : field.value?.filter((value) => value !== item.id);
                                          field.onChange(newValue);
                                          }}
                                      />
                                      </FormControl>
                                      <FormLabel className={cn("font-normal flex-grow", isSelected && "font-medium")}>
                                      {item.label}
                                      </FormLabel>
                                      {isSelected && (
                                      <div className="ml-auto flex items-center gap-2">
                                          <span className="text-sm font-medium text-muted-foreground">
                                          Qtd: {quantityValue}
                                          </span>
                                          <button type="button" onClick={() => toggleSelector(item.id)} className="p-1">
                                          <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isSelectorOpen && "rotate-180")} />
                                          </button>
                                      </div>
                                      )}
                                  </FormItem>
                                  )}
                              />
                              {isSelected && isSelectorOpen && (
                                  <div className="pt-2 pl-7">
                                  <FormField
                                      control={form.control}
                                      name={quantityFieldName as any}
                                      render={({ field }) => (
                                      <FormItem>
                                          <FormLabel className="text-xs text-muted-foreground">{getQuantityLabel(item.id)}</FormLabel>
                                          <Select
                                          onValueChange={(value) => {
                                              field.onChange(value);
                                              toggleSelector(item.id);
                                          }}
                                          value={field.value}
                                          >
                                          <FormControl>
                                              <SelectTrigger>
                                              <SelectValue placeholder="Selecione a quantidade" />
                                              </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                              {[...Array(10)].map((_, i) => (
                                              <SelectItem key={i + 1} value={`${i + 1}`}>
                                                  {i + 1}
                                              </SelectItem>
                                              ))}
                                          </SelectContent>
                                          </Select>
                                          <FormMessage />
                                      </FormItem>
                                      )}
                                  />
                                  </div>
                              )}
                              </div>
                          );
                          })}
                      </div>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  
                  {totalCost > 0 && (
                      <Card className="bg-muted/50">
                          <CardHeader className="p-4">
                              <CardTitle className="text-lg">Orçamento</CardTitle>
                              <CardDescription>Resumo dos custos dos serviços selecionados.</CardDescription>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                              <div className="space-y-2">
                                  {watchedServices.map(serviceId => {
                                      const id = serviceId as ServiceId;
                                      const service = services.find(s => s.id === id);
                                      const price = servicePrices[id];
                                      if (!service) return null;
                                      
                                      let subtotal = 0;
                                      let labelText = "";
                                      
                                      if (id === 'diaria') {
                                          const collaborators = serviceQuantities.diaria;
                                          const days = (watchedStartDate && watchedEndDate) ? calculateBusinessDays(watchedStartDate, watchedEndDate) : 0;
                                          if (days > 0 && collaborators > 0) {
                                              subtotal = price * collaborators * days;
                                              labelText = `${service.label} (${collaborators} x ${days}d)`;
                                          }
                                      } else {
                                          const quantity = serviceQuantities[id];
                                          if (quantity > 0) {
                                              subtotal = price * quantity;
                                              labelText = `${service.label} (x${quantity})`;
                                          }
                                      }

                                      if (subtotal === 0) return null;

                                      return (
                                          <div key={id} className="flex justify-between text-sm">
                                              <span>{labelText}</span>
                                              <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                          </div>
                                      )
                                  })}
                                  <div className="border-t border-border my-2"></div>
                                  <div className="flex justify-between font-bold text-base">
                                      <span>Total</span>
                                      <span>{totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  )}
              </div>
          </ScrollArea>

          <Button type="submit" disabled={isGenerating} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Contrato...
              </>
            ) : (
              "Aceitar Proposta"
            )}
          </Button>
        </form>
      </Form>
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
            <DialogHeader>
                <DialogTitle>Pré-visualização do Contrato</DialogTitle>
                <DialogDescription>
                    Revise o contrato gerado. Você pode baixar em PDF ou imprimir.
                </DialogDescription>
            </DialogHeader>
            <div className="flex-grow bg-white my-4">
                <ScrollArea className="h-full">
                    <div
                        className="p-8 prose prose-sm max-w-none text-black"
                        style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
                        dangerouslySetInnerHTML={{
                            __html: generatedContract
                                ? generatedContract
                                    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                                    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                                    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br />')
                                : ''
                        }}
                    />
                </ScrollArea>
            </div>
            <DialogFooter className="sm:justify-between">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Fechar
                    </Button>
                </DialogClose>
                <div className="flex gap-2">
                    <Button onClick={handleDownloadPdf}>
                        <Download className="mr-2 h-4 w-4" />
                        Baixar PDF
                    </Button>
                    <Button onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
