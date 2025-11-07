import { z } from 'zod';

export const GenerateContractInputSchema = z.object({
  companyName: z.string().describe('O nome da empresa contratante.'),
  cnpj: z.string().describe('O CNPJ da empresa contratante.'),
  responsibleName: z.string().describe('O nome do responsável pela empresa contratante.'),
  startDate: z.string().describe('A data de início da prestação de serviços.'),
  endDate: z.string().describe('A data final da prestação de serviços.'),
  totalCost: z.string().describe('O custo total do contrato.'),
  servicesDetails: z.array(z.object({
    service: z.string().optional(),
    quantity: z.union([z.string(), z.number()]).optional(),
    subtotal: z.string().optional(),
  })).describe('Uma lista detalhada dos serviços contratados, suas quantidades e subtotais.'),
});
export type GenerateContractInput = z.infer<typeof GenerateContractInputSchema>;

export const GenerateContractOutputSchema = z.object({
  contractText: z.string().describe('O texto completo do contrato gerado em formato Markdown.'),
});
export type GenerateContractOutput = z.infer<typeof GenerateContractOutputSchema>;
