import scents from '../data/scents';

export function calculateRecipe(
  counts: Record<string, number>
): { key: string; percent: number }[] {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return [];
  }

  return Object.entries(counts)
    .map(([key, count]) => ({
      key,
      percent: Math.round((count / total) * 100)
    }))
    .sort((left, right) => right.percent - left.percent);
}

export function generateName(
  sentence: string,
  recipe: { key: string; percent: number }[]
): string {
  if (recipe.length === 0) {
    return '이름 없는 향수';
  }

  const leadScent = scents.find((scent) => scent.key === recipe[0].key)?.name ?? '비밀';
  const firstWord = sentence.split(' ')[0] ?? '공방';

  return `${firstWord}의 ${leadScent}`;
}

export function generateDescription(
  sentence: string,
  recipe: { key: string; percent: number }[]
): string {
  if (recipe.length === 0) {
    return '아직 향료가 선택되지 않았어요.';
  }

  const mainNotes = recipe
    .slice(0, 2)
    .map((entry) => scents.find((scent) => scent.key === entry.key)?.name)
    .filter((name): name is string => Boolean(name));

  return `${sentence}를 떠올리며 조합한 향수예요. ${
    mainNotes.length > 0 ? `${mainNotes.join('과 ')} 중심의 노트가` : '선택한 향료가'
  } 공방의 포근한 잔향처럼 천천히 퍼집니다.`;
}
