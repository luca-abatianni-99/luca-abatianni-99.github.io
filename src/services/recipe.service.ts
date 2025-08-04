import { Injectable } from '@angular/core';
import { RecipeModel } from '../models/common.models';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private recipes: RecipeModel[] = [];

  saveRecipes(recipes: RecipeModel[]) {
    this.recipes = recipes;
  }

  getRecipeById(id: number) {
    return this.recipes.find(r => r.id === id);
  }

  getAllRecipes() {
    return this.recipes;
  }
}
