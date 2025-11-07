'use server';
/**
 * @fileOverview A contract generation AI agent.
 *
 * - generateContract - A function that handles the contract generation process.
 */

import { ai } from '@/ai/genkit';
import { GenerateContractInputSchema, GenerateContractOutputSchema, type GenerateContractInput, type GenerateContractOutput } from './contract-schemas';


export async function generateContract(input: GenerateContractInput): Promise<GenerateContractOutput> {
  const { output } = await prompt(input);
  return output!;
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
    - Endereço: {{{companyLocation}}}

    **Detalhes do Contrato:**
    - Período de Vigência: De {{{startDate}}} a {{{endDate}}}.
    - Custo Total: {{{totalCost}}}

    **Serviços Contratados:**
    {{#each servicesDetails}}
    - Serviço: {{service}}, Quantidade/Detalhe: {{quantity}}, Subtotal: {{subtotal}}
    {{/each}}

    **Estrutura do Contrato:**
    Gere um contrato em formato Markdown com as seguintes seções:

    1.  **PARTES CONTRATANTES:** Identifique a CONTRATANTE (com os dados fornecidos, incluindo nome, CNPJ e endereço) e a CONTRATADA (Albino Prestação de Serviços, nome fantasia de GUSTAVO MANASSES ALBINO, CNPJ 44.743.063/0001-03, com sede em Garuva, Santa Catarina, CEP 89248-000, doravante denominada "Contratada").
    2.  **OBJETO DO CONTRATO:** Descreva claramente os serviços que serão prestados, com base nos 'Serviços Contratados'.
    3.  **PRAZO:** Especifique o período de vigência do contrato usando as datas de início e fim.
    4.  **VALOR E FORMA DE PAGAMENTO:** Mencione o 'Custo Total' e especifique que o pagamento será realizado via PIX ou transferência bancária em até 5 dias úteis após a emissão da nota fiscal.
    5.  **OBRIGAÇÕES DA CONTRATADA:** Detalhe as responsabilidades da Albino Prestação de Serviços, como:
        - Fornecer mão de obra qualificada.
        - Cumprir os horários e prazos.
        - Zelar pela segurança e integridade das mercadorias.
    6.  **OBRIGAÇÕES DA CONTRATANTE:** Detalhe as responsabilidades da empresa contratante, como:
        - Fornecer todas as informações necessárias para a execução dos serviços.
        - Garantir um local seguro para a execução dos trabalhos.
        - Efetuar o pagamento nos prazos acordados.
    7.  **RESCISÃO:** Defina as condições para rescisão, como quebra de qualquer cláusula contratual ou acordo mútuo, com notificação prévia de 15 dias.
    8.  **FORO:** Defina o foro da comarca de {{{companyLocation}}} para dirimir quaisquer dúvidas.
    9.  **ASSINATURAS:** Inclua espaços para as assinaturas dos representantes legais de ambas as partes.

    O tom deve ser formal e profissional. O objetivo é criar um documento juridicamente sólido e equilibrado.
    Formate a saída como um único bloco de texto em Markdown.
  `,
});
