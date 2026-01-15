
import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";

export const getAIInterpretation = async (results: AssessmentResult) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Analise os seguintes resultados de testes comportamentais e de valores para gerar um relatório profissional:

    RESULTADOS DNA COMPORTAMENTAL (DISC - 0 a 100):
    D: ${results.disc.D}
    I: ${results.disc.I}
    S: ${results.disc.S}
    C: ${results.disc.C}

    RESULTADOS VALORES MOTIVACIONAIS (Spranger - 0 a 100):
    Político (P): ${results.values.P}
    Econômico (E): ${results.values.E}
    Religioso (R): ${results.values.R}
    Social (S): ${results.values.S}
    Estético (B): ${results.values.B}
    Teórico (T): ${results.values.T}

    INSTRUÇÕES:
    1. Identifique o tipo de perfil DISC (Puro, Duplo, Triplo ou Equilibrado).
    2. Gere um texto resumido e impactante sobre o DNA Comportamental.
    3. Analise os valores motivacionais principais.
    4. Faça o cruzamento HLA (Ex: Econômico + Espiritual).
    5. Forneça "Fatores Amplificadores" e "Fatores de Risco".
    6. Identifique o "Ambiente Ideal" e "Mapa de Comunicação".
    7. Use um tom profissional, empático e inspirador.
    
    Responda em formato Markdown, estruturado para exibição em uma página web.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro na interpretação da IA:", error);
    return "Desculpe, não foi possível gerar o resumo automático no momento. Por favor, analise os gráficos abaixo.";
  }
};
