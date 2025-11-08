'use server';
import {genkit} from '@/ai/genkit';
import {nextJSHandler} from '@genkit-ai/next';

// This is required for Genkit to work in production.
// It creates a Next.js API route that the Genkit library can call.
export const POST = nextJSHandler(genkit);
