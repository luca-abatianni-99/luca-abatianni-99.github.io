import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { SupabaseService } from '../../services/supabase.service';
import { IngredientModel, RecipeModel, StepModel } from '../../models/common.models';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CommonModule } from '@angular/common';
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject, takeUntil, Observable, Observer, BehaviorSubject, Subscription } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

export enum DishTypeDictionary {
  PRIMI,
  SECONDI,
  CONTORNI,
  DOLCI,
}

@Component({
  selector: 'app-recipe-book',
  imports: [
    CommonModule,
    NzTypographyComponent,
    NzFlexModule,
    NzCardModule,
    NzRowDirective,
    NzColDirective,
    NzTabsModule,
    NzFloatButtonModule,
    NzIconModule,
    NzModalModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSkeletonModule,
    NzEmptyModule,
    NzDividerModule,
    NzPopconfirmModule,
  ],
  templateUrl: './recipe-book.component.html',
  styleUrl: './recipe-book.component.css',
})
export class RecipeBookComponent implements OnInit, OnDestroy {
  recipes: RecipeModel[] = [];
  currentFilter: BehaviorSubject<string> = new BehaviorSubject<string>('primo');
  displayRecipes: RecipeModel[] = [];
  newRecipeFormGroup: FormGroup = new FormGroup([]);
  dishTypeDictionary = DishTypeDictionary;

  subsToUnsub: Subscription[] = [];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private recipeService: RecipeService,
    private fb: NonNullableFormBuilder,
  ) {}

  ngOnInit(): void {
    this.getRecipes();
    this.initNewRecipeForm();
  }

  ngOnDestroy(): void {
    this.subsToUnsub.forEach(sub => sub.unsubscribe());
    this.subsToUnsub = [];
  }

  async getRecipes() {
    this.recipes = await this.supabaseService.getRecipes();
    this.recipeService.saveRecipes(this.recipes);
    const filterSub = this.currentFilter.subscribe(filter => {
      console.log(filter);
      this.displayRecipes = this.recipes.filter(recipe => recipe.tags === filter);
    });
    this.subsToUnsub.push(filterSub);
  }

  onClickRecipe(id: number | undefined) {
    if (id) {
      this.router.navigate(['/recipe-book', id]);
    }
  }

  async confirmDelete(id: number | undefined) {
    if (id) {
      await this.supabaseService.deleteRecipe(id);
      await this.getRecipes()
    }
  }

  newRecipeModalVisible = false;

  showNewReicipeModal(): void {
    this.newRecipeModalVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    if (this.newRecipeFormGroup.valid) {
      this.submitForm();
      this.newRecipeModalVisible = false;
    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.newRecipeModalVisible = false;
    this.resetForm();
  }

  initNewRecipeForm() {
    this.newRecipeFormGroup = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      description: this.fb.control('', []),
      tags: this.fb.control('primo', [Validators.required]),
      prepTime: this.fb.control(0, [Validators.required]),
      cookTime: this.fb.control(0, [Validators.required]),
      servings: this.fb.control(2, [Validators.required]),
      ingredients: this.fb.array([]),
      steps: this.fb.array([]),
      imgUrl: this.fb.control('', []),
      notes: this.fb.control('', []),
    });
    this.addField();
    this.addIngredient();
  }

  async submitForm() {
    console.log('submit', this.newRecipeFormGroup.value);
    console.log('submit', this.newRecipeFormGroup.valid);
    if (this.newRecipeFormGroup.valid) {
      const formValue = this.newRecipeFormGroup.value;

      const ingredients: IngredientModel[] = formValue.ingredients.map((ing: any) => ({
        name: ing.name,
        quantity: ing.quantity,
      }));

      const steps: StepModel[] = formValue.steps.map((step: any, index: number) => ({
        position: index + 1,
        description: step.description,
      }));

      const recipe: RecipeModel = {
        title: formValue.title,
        description: formValue.description,
        tags: formValue.tags,
        prepTime: formValue.prepTime,
        cookTime: formValue.cookTime,
        servings: formValue.servings,
        ingredients,
        steps,
        imgUrl: formValue.imgUrl,
        notes: formValue.notes,
      };

      await this.supabaseService.saveNewRecipe(recipe);
      await this.getRecipes();
    } else {
      console.warn('Form invalido');
    }
  }

  resetForm(): void {
    this.removeAllFields();
    this.removeAllIngredients();
    this.newRecipeFormGroup.reset();
  }

  listOfStepsControl: Array<{ id: number; controlInstance: string }> = [];

  get steps(): FormArray {
    return this.newRecipeFormGroup.get('steps') as FormArray;
  }

  addField(e?: MouseEvent): void {
    e?.preventDefault();

    /* const id =
      this.listOfStepsControl.length > 0
        ? this.listOfStepsControl[this.listOfStepsControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: `step-${id}`,
    };
    const index = this.listOfStepsControl.push(control);
    console.log(this.listOfStepsControl[this.listOfStepsControl.length - 1]);
    this.newRecipeFormGroup.addControl(
      this.listOfStepsControl[index - 1].controlInstance,
      this.fb.control('', Validators.required),
    ); */

    const position = this.steps.length + 1;
    const stepGroup = this.fb.group({
      position: [position],
      description: ['', Validators.required],
    });
    this.steps.push(stepGroup);
  }

  removeField(index: number, e: MouseEvent): void {
    e.preventDefault();
    /* if (this.listOfStepsControl.length > 1) {
      const index = this.listOfStepsControl.indexOf(i);
      this.listOfStepsControl.splice(index, 1);
      console.log(this.listOfStepsControl);
      this.newRecipeFormGroup.removeControl(i.controlInstance);
    } */

    if (this.steps.length > 1) {
      this.steps.removeAt(index);
      this.recalculatePositions();
    }
  }

  private recalculatePositions() {
    this.steps.controls.forEach((ctrl, idx) => {
      ctrl.get('position')?.setValue(idx + 1);
    });
  }

  removeAllFields() {
    /* this.listOfStepsControl.forEach(step => {
      this.newRecipeFormGroup.removeControl(step.controlInstance);
    });
    this.listOfStepsControl = []; */
    this.steps.clear();
  }

  listOfIngredilistOfIngredientsControlentsControl: Array<{
    id: number;
    ingredientNameControl: string;
    ingredientQtyControl: string;
  }> = [];

  get ingredients(): FormArray {
    return this.newRecipeFormGroup.get('ingredients') as FormArray;
  }

  addIngredient(e?: MouseEvent): void {
    e?.preventDefault();

    /* const id =
      this.listOfIngredientsControl.length > 0
        ? this.listOfIngredientsControl[this.listOfIngredientsControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      ingredientNameControl: `ingredient-name-${id}`,
      ingredientQtyControl: `ingredient-qty-${id}`,
    };
    const index = this.listOfIngredientsControl.push(control); */

    const newIngredient = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });
    this.ingredients.push(newIngredient);

    /* this.newRecipeFormGroup.addControl(
      this.listOfIngredientsControl[index - 1].ingredientNameControl,
      this.fb.control('', [Validators.required]),
    );
    this.newRecipeFormGroup.addControl(
      this.listOfIngredientsControl[index - 1].ingredientQtyControl,
      this.fb.control('', [Validators.required]),
    ); */
  }

  removeIngredient(
    /* i: { id: number; ingredientNameControl: string; ingredientQtyControl: string }, */
    index: number,
    e: MouseEvent,
  ): void {
    e.preventDefault();
    /* if (this.listOfIngredientsControl.length > 1) {
      const index = this.listOfIngredientsControl.indexOf(i);
      this.listOfIngredientsControl.splice(index, 1);
      console.log(this.listOfIngredientsControl);
      this.newRecipeFormGroup.removeControl(i.ingredientNameControl);
      this.newRecipeFormGroup.removeControl(i.ingredientQtyControl);
    } */
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  removeAllIngredients() {
    /* this.listOfIngredientsControl.forEach(ingr => {
      this.newRecipeFormGroup.removeControl(ingr.ingredientNameControl);
      this.newRecipeFormGroup.removeControl(ingr.ingredientQtyControl);
    });
    this.listOfIngredientsControl = []; */
    this.ingredients.clear();
  }
}
