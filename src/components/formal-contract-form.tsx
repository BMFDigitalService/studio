"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

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
import { ChevronDown } from "lucide-react";

const services = [
  { id: "carga", label: "Carga" },
  { id: "descarga", label: "Descarga" },
  { id: "transbordo", label: "Transbordo" },
  { id: "diaria", label: "Diária" },
] as const;

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
  services: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você deve selecionar pelo menos um serviço.",
  }),
  quantityCarga: z.string().optional(),
  quantityDescarga: z.string().optional(),
  quantityTransbordo: z.string().optional(),
  numberOfCollaborators: z.string().optional(),
});

type ServiceId = (typeof services)[number]["id"];

export function FormalContractForm() {
  const { toast } = useToast();
  const [openSelectors, setOpenSelectors] = useState<Record<string, boolean>>({});

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

  const serviceQuantities: Record<ServiceId, string | undefined> = {
    carga: watchedQuantities[0],
    descarga: watchedQuantities[1],
    transbordo: watchedQuantities[2],
    diaria: watchedQuantities[3],
  };

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    toast({
      title: "Proposta enviada com sucesso!",
      description: "Nossa equipe entrará em contato em breve para formalizar o contrato.",
    });
    form.reset();
  }

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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            name={quantityFieldName}
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
        
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
          Enviar Proposta
        </Button>
      </form>
    </Form>
  );
}
