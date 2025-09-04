export type MovieModel = {
  id?: number;
  title?: string;
  description?: string;
  link?: string;
  notes?: string;
  score?: number;
  seen?: boolean;
  director?: string;
  actors?: string;
  released?: string;
  genre?: string;
  imdbRating?: number
  imdbID?: string
  poster?: string
};

export type RecipeModel = {
  id?: number;
  title?: string;
  description?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imgUrl?: string;
  tags?: string;
  ingredients?: IngredientModel[];
  steps?: StepModel[];
  notes?: string;
};

export type IngredientModel = {
  name?: string;
  quantity?: string;
};

export type StepModel = {
  position?: number;
  description?: string;
};

export type Option = {
  id: number;
  text: string;
  correct: boolean;
};

export type Question = {
  id: number;
  text: string;
  options: Option[];
};
