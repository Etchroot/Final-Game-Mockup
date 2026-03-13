import scents from '../data/scents';

export interface RecipeNote {
  key: string;
  percent: number;
}

export function calculateRecipe(counts: Record<string, number>): RecipeNote[] {
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

export function generateName(sentence: string, recipe: RecipeNote[]): string {
  if (recipe.length === 0) {
    return '이름 없는 향수';
  }

  const leadScent = scents.find((scent) => scent.key === recipe[0].key)?.name ?? '비밀';
  const firstWord = sentence.split(' ')[0] ?? '공방';

  return `${firstWord}의 ${leadScent}`;
}

export function formatRecipeForPrompt(recipe: RecipeNote[]): string {
  return recipe
    .map((entry) => {
      const scentName = scents.find((scent) => scent.key === entry.key)?.name ?? entry.key;
      return `- ${scentName}: ${entry.percent}%`;
    })
    .join('\n');
}

export function generateDescription(sentence: string, recipe: RecipeNote[]): string {
  if (recipe.length === 0) {
    return '아직 향료가 선택되지 않았어요.';
  }

  const noteNames = recipe
    .slice(0, 2)
    .map((entry) => scents.find((scent) => scent.key === entry.key)?.name)
    .filter((name): name is string => Boolean(name));

  const [firstNote = '은은한 향', secondNote = '잔향'] = noteNames;

  return `${sentence}\n\n${firstNote}의 결이 먼저 번지고\n${secondNote}가 조용히 겹쳐지며\n작은 공방 안에 포근한 여운을 남깁니다.`;
}
