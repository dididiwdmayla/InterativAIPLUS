import { GoogleGenAI } from '@google/genai';
import { lerEntrada, lerResposta, SEM_SINAL } from '@/tutor/contrato';
import { SYSTEM_PROMPT } from '@/tutor/prompt';
import { EXPRESSOES } from '@/motor/expressao';
export const runtime = 'nodejs';
export const maxDuration = 30;
const LIMITE_BYTES = 24000;
async function corpoLimitado(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > LIMITE_BYTES) throw new Error('Corpo grande');
  const leitor = request.body?.getReader();
  if (!leitor) throw new Error('Corpo ausente');
  const decoder = new TextDecoder(); let texto = '', bytes = 0;
  try {
    for (;;) {
      const { done, value } = await leitor.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > LIMITE_BYTES) { await leitor.cancel(); throw new Error('Corpo grande'); }
      texto += decoder.decode(value, { stream: true });
    }
    return JSON.parse(texto + decoder.decode()) as unknown;
  } finally { leitor.releaseLock(); }
}
export async function POST(request: Request) {
  const responder = (fala: typeof SEM_SINAL, status = 200) => Response.json(fala, { status, headers: { 'Cache-Control': 'no-store' } });
  const origem = request.headers.get('origin');
  if (origem && origem !== new URL(request.url).origin) return responder(SEM_SINAL, 403);
  let entrada;
  try { entrada = lerEntrada(await corpoLimitado(request)); } catch { return responder(SEM_SINAL, 400); }
  if (!entrada) return responder(SEM_SINAL, 400);
  if (!process.env.GEMINI_API_KEY) return responder(SEM_SINAL);
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const resposta = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents: JSON.stringify(entrada),
      config: {
        systemInstruction: SYSTEM_PROMPT, temperature: 0.5, maxOutputTokens: 800,
        abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(20000)]),
        responseMimeType: 'application/json',
        responseJsonSchema: { type: 'object', properties: {
          texto: { type: 'string' }, expressao: { type: 'string', enum: [...EXPRESSOES] },
        }, required: ['texto', 'expressao'], additionalProperties: false },
      },
    });
    return responder(lerResposta(resposta.text));
  } catch { return responder(SEM_SINAL); }
}
