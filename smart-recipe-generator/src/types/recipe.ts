export type DietaryTag = "vegetarian" | "vegan" | "gluten-free";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  difficulty: Difficulty;
  dietary: DietaryTag[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  image?: string | null;
  tags: string[];
};
