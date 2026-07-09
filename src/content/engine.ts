import { generateText, Output } from 'ai';
import { generationResultSchema, type GenerationInput, type Variant } from './schema';
import { buildPrompt } from './prompt';
import { checkGuardrails } from './guardrails';

// Modell verifisert via ai-gateway/v1/models (2026-07). Re-verifiser ved behov.
const CONTENT_MODEL = 'anthropic/claude-sonnet-5';

export type EngineVariant = Variant & { guardrailFlags: string[] };

export async function generateVariants(
  input: GenerationInput,
): Promise<{ variants: EngineVariant[]; model: string }> {
  const { output } = await generateText({
    model: CONTENT_MODEL,
    output: Output.object({ schema: generationResultSchema }),
    prompt: buildPrompt(input),
  });
  const variants = output.variants.map((v) => ({
    ...v,
    guardrailFlags: checkGuardrails(`${v.caption} ${v.hashtags.join(' ')}`),
  }));
  return { variants, model: CONTENT_MODEL };
}
