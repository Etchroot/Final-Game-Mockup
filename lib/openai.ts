import { formatRecipeForPrompt, generateDescription, RecipeNote } from './recipeUtils';

const SYSTEM_PROMPT =
  '너는 향수 공방에서 향수를 설명하는 감성적인 카피라이터다.';

export async function generatePerfumeDescription(
  sentence: string,
  recipe: RecipeNote[]
) {
  const fallback = generateDescription(sentence, recipe);

  if (!process.env.OPENAI_API_KEY) {
    return { description: fallback };
  }

  const prompt = `사용자가 아래 문장에 맞춰 향수를 만들었다.

문장:
${sentence}

향 레시피:
${formatRecipeForPrompt(recipe)}

이 향들이 섞였을 때 느껴질 수 있는 분위기와 감정을 상상하여
아름다운 시적인 문장으로 설명해라.

조건
- 한국어
- 줄바꿈 포함
- 너무 길지 않게
- 감정적인 표현 사용`;

  try {
    const response = await fetch(
      `${process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
          temperature: 0.95,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error('OpenAI request failed');
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return {
      description: data.choices?.[0]?.message?.content?.trim() || fallback
    };
  } catch {
    return { description: fallback };
  }
}
