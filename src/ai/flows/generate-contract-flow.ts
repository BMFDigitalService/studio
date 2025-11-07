'use server';
/**
 * @fileOverview A contract generation AI agent.
 *
 * - generateContract - A function that handles the contract generation process.
 * - GenerateContractInput - The input type for the generateContract function.
 * - GenerateContractOutput - The return type for the generateContract function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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

export async function generateContract(input: GenerateContractInput): Promise<GenerateContractOutput> {
  return generateContractFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContractPrompt',
  input: { schema: GenerateContractInputSchema },
  output: { schema: GenerateContractOutputSchema },
  prompt: `
    Você é um assistente jurídico especializado em criar contratos de prestação de serviços de logística.
    Sua tarefa é gerar um contrato formal, claro, conciso e que proteja ambas as partes (Contratante e Contratada).

    Use as informações fornecidas para preencher o contrato.

    **Informações da Contratante:**
    - Nome da Empresa: {{{companyName}}}
    - CNPJ: {{{cnpj}}}
    - Responsável: {{{responsibleName}}}

    **Detalhes do Contrato:**
    - Período de Vigência: De {{{startDate}}} a {{{endDate}}}.
    - Custo Total: {{{totalCost}}}

    **Serviços Contratados:**
    {{#each servicesDetails}}
    - Serviço: {{service}}, Quantidade/Detalhe: {{quantity}}, Subtotal: {{subtotal}}
    {{/each}}

    **Estrutura do Contrato:**
    Gere um contrato em formato Markdown com as seguintes seções:

    1.  **PARTES CONTRATANTES:** Identifique a CONTRATANTE (com os dados fornecidos) e a CONTRATADA (Albino Logistics, CNPJ 12.345.678/0001-99).
    2.  **OBJETO DO CONTRATO:** Descreva claramente os serviços que serão prestados, com base nos 'Serviços Contratados'.
    3.  **PRAZO:** Especifique o período de vigência do contrato usando as datas de início e fim.
    4.  **VALOR E FORMA DE PAGAMENTO:** Mencione o 'Custo Total' e especifique que o pagamento será realizado via PIX ou transferência bancária em até 5 dias úteis após a emissão da nota fiscal.
    5.  **OBRIGAÇÕES DA CONTRATADA:** Detalhe as responsabilidades da Albino Logistics, como:
        - Fornecer mão de obra qualificada.
        - Cumprir os horários e prazos.
        - Zelar pela segurança e integridade das mercadorias.
    6.  **OBRIGAÇÕES DA CONTRATANTE:** Detalhe as responsabilidades da empresa contratante, como:
        - Fornecer todas as informações necessárias para a execução dos serviços.
        - Garantir um local seguro para a execução dos trabalhos.
        - Efetuar o pagamento nos prazos acordados.
    7.  **RESCISÃO:** Defina as condições para rescisão, como quebra de qualquer cláusula contratual ou acordo mútuo, com notificação prévia de 15 dias.
    8.  **FORO:** Defina o foro da comarca da capital do estado da CONTRATADA para dirimir quaisquer dúvidas.
    9.  **ASSINATURAS:** Inclua espaços para as assinaturas dos representantes legais de ambas as partes.

    O tom deve ser formal e profissional. O objetivo é criar um documento juridicamente sólido e equilibrado.
    Formate a saída como um único bloco de texto em Markdown.
  `,
});

const generateContractFlow = ai.defineFlow(
  {
    name: 'generateContractFlow',
    inputSchema: GenerateContractInputSchema,
    outputSchema: GenerateContractOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

    