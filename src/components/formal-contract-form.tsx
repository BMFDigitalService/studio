"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export function FormalContractForm() {
  const { toast } = useToast();

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

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    toast({
      title: "Proposta enviada com sucesso!",
      description: "Nossa equipe entrará em contato em breve para formalizar o contrato.",
    });
    form.reset();
  }

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
              <div className="grid grid-cols-2 gap-4">
                {services.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="services"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {watchedServices.includes("carga") && (
          <FormField
            control={form.control}
            name="quantityCarga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Cargas</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        )}
        {watchedServices.includes("descarga") && (
          <FormField
            control={form.control}
            name="quantityDescarga"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Descargas</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        )}
        {watchedServices.includes("transbordo") && (
          <FormField
            control={form.control}
            name="quantityTransbordo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Transbordos</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        )}
        {watchedServices.includes("diaria") && (
          <FormField
            control={form.control}
            name="numberOfCollaborators"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade de Colaboradores</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
        )}
        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
          Enviar Proposta
        </Button>
      </form>
    </Form>
  );
}
