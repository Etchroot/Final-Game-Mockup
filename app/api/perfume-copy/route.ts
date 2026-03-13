import { NextResponse } from 'next/server';
import { generatePerfumeDescription } from '../../../lib/openai';
import { RecipeNote } from '../../../lib/recipeUtils';

interface RequestBody {
  sentence?: string;
  recipe?: RecipeNote[];
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.sentence || !Array.isArray(body.recipe)) {
      return NextResponse.json(
        { error: '문장 또는 레시피 정보가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const result = await generatePerfumeDescription(body.sentence, body.recipe);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: '향수 설명을 생성하지 못했습니다.' },
      { status: 500 }
    );
  }
}
