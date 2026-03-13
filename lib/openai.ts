import { OpenAI } from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

export async function generatePerfumeDescription(sentence: string, recipe: Record<string, number>) {
  if (!process.env.OPENAI_API_KEY) {
    // mock response
    return {
      name: 'Mock 향수',
      keywords: ['감성', '몽환', '달콤'],
      description: '이 향수는 문장과 어울리는 부드러운 향으로 구성되었습니다.',
      marketing: '당신만의 향을 경험해보세요!'
    };
  }

  const prompt = `너는 귀엽고 장난스러운 분위기의 향수 공방 게임에서 향수를 설명하는 카피라이터다.\n
사용자가 '${sentence}' 문장에 맞춰 아래 레시피로 향수를 만들었다.\n${JSON.stringify(recipe)}\n\n이 향수의 이름, 분위기 키워드 3개, 감성적인 설명 2문장, 마케팅용 한 줄 소개를 작성해라.`;

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    input: prompt,
    temperature: 0.8
  });

  // parse response text--here we just return raw text for prototype
  // TODO: 실제 구조화된 객체로 변환하고 UI에 반영
  return { raw: response.output[0].content[0].text };
}
