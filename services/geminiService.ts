
import { GoogleGenAI } from "@google/genai";
import { Deal, Client } from '../types';

const API_KEY = process.env.API_KEY;

export async function generateProposalDraft(dealTitle: string, clientName: string, value: number): Promise<string | undefined> {
  if (!API_KEY) return "API Key not configured. Please check environment variables.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `
      Act as a professional sales executive for Nexus CRM. 
      Create a compelling and sophisticated sales proposal draft with the following details:
      Client: ${clientName}
      Project/Deal: ${dealTitle}
      Value: $${value.toLocaleString()}
      
      The proposal should include:
      1. An executive summary.
      2. Scope of work.
      3. Value proposition.
      4. Pricing and timeline.
      
      Style: Modern, persuasive, clear, and business-focused. Use professional headers.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error generating proposal:", error);
    return "The system encountered an error while generating your AI proposal. Please try again in a few moments.";
  }
}

export async function analyzeColdLeads(deals: Deal[], clients: Client[]): Promise<string | undefined> {
  if (!API_KEY) return "API Key not configured.";

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const dealsInfo = deals.map(d => ({
      title: d.title,
      value: d.value,
      client: clients.find(c => c.id === d.clientId)?.name,
      createdAt: d.createdAt,
      probability: d.probability
    }));

    const prompt = `
      Act as a Senior Sales Analyst. Analyze the following list of deals and identify 3 "Cold Leads" that need immediate attention.
      For each lead, provide a short "Action Plan" (max 2 sentences).
      
      Deals: ${JSON.stringify(dealsInfo)}
      
      Current Date: ${new Date().toLocaleDateString()}
      
      Format the output in a professional dashboard style.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [{ text: prompt }] }],
    });

    return response.text;
  } catch (error) {
    console.error("Error analyzing leads:", error);
    return "AI Insight temporarily unavailable.";
  }
}
