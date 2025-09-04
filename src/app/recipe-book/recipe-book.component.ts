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
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzImageModule } from 'ng-zorro-antd/image';

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
    NzUploadModule,
    NzImageModule,
  ],
  templateUrl: './recipe-book.component.html',
  styleUrl: './recipe-book.component.css',
})
export class RecipeBookComponent implements OnInit, OnDestroy {
  recipes: RecipeModel[] = [];
  currentFilter: BehaviorSubject<string> = new BehaviorSubject<string>('primo');
  displayRecipes: RecipeModel[] = [];
  newRecipeFormGroup: FormGroup = new FormGroup([]);
  selectedRecipePhoto: NzUploadFile[] = [];
  dishTypeDictionary = DishTypeDictionary;
  newRecipeModalVisible = false;
  editingRecipe: boolean = false;
  editedRecipeId: number = -1;

  subsToUnsub: Subscription[] = [];

  constructor(
    private router: Router,
    private supabaseService: SupabaseService,
    private recipeService: RecipeService,
    private fb: NonNullableFormBuilder,
    private message: NzMessageService,
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
      this.displayRecipes = this.recipes
        .filter(recipe => recipe.tags === filter)
        .sort((a, b) => {
          const idA = a.id ?? -1;
          const idB = b.id ?? -1;
          return idA - idB;
        });
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
      await this.getRecipes();
      this.message.create('success', 'Ricetta eliminata con successo');
    } else {
      this.message.create('error', 'Impossibile eliminare la ricetta');
    }
  }

  showNewReicipeModal(editingRecipe: boolean, recipeId?: number): void {
    if (editingRecipe && !recipeId) {
      return;
    }
    this.newRecipeModalVisible = true;
    this.editingRecipe = editingRecipe;
    if (editingRecipe && recipeId) {
      this.initEditRecipeForm(recipeId);
    } else if (!editingRecipe) {
      this.initNewRecipeForm();
    }
  }

  onFileSelected(event: any) {
    this.selectedRecipePhoto = event.target.files[0];
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
    this.selectedRecipePhoto = [];
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

  initEditRecipeForm(id: number) {
    const recipeToEdit = this.recipes.find(rec => rec.id === id);
    if (!recipeToEdit) {
      this.newRecipeModalVisible = false;
      return;
    }
    this.editedRecipeId = id;

    const ingredientsToEdit = recipeToEdit?.ingredients
      ? recipeToEdit.ingredients.map(ingr =>
          this.fb.group({
            name: [ingr.name, Validators.required],
            quantity: [ingr.quantity, Validators.required],
          }),
        )
      : [];

    const stepsToEdit = recipeToEdit?.steps
      ? recipeToEdit.steps.map(step =>
          this.fb.group({
            position: [step.position, []],
            description: [step.description ?? '', Validators.required],
          }),
        )
      : [];

    this.newRecipeFormGroup = this.fb.group({
      title: this.fb.control(recipeToEdit?.title ?? '', [Validators.required]),
      description: this.fb.control(recipeToEdit?.description ?? '', []),
      tags: this.fb.control(recipeToEdit?.tags ?? 'primo', [Validators.required]),
      prepTime: this.fb.control(recipeToEdit?.prepTime ?? 0, [Validators.required]),
      cookTime: this.fb.control(recipeToEdit?.cookTime ?? 0, [Validators.required]),
      servings: this.fb.control(recipeToEdit?.servings ?? 2, [Validators.required]),
      ingredients: this.fb.array(ingredientsToEdit ?? []),
      steps: this.fb.array(stepsToEdit ?? []),
      imgUrl: this.fb.control(recipeToEdit?.imgUrl ?? '', []),
      notes: this.fb.control(recipeToEdit?.notes ?? '', []),
    });
  }

  async submitForm() {
    console.log('submit', this.newRecipeFormGroup.value);
    console.log('submit', this.newRecipeFormGroup.valid);
    if (this.newRecipeFormGroup.valid) {
      const formValue = this.newRecipeFormGroup.value;
      const lastSelectedPhotoIndex = this.selectedRecipePhoto.length - 1;

      const rawFile =
        this.selectedRecipePhoto &&
        this.selectedRecipePhoto[0] &&
        this.selectedRecipePhoto[0].originFileObj
          ? (this.selectedRecipePhoto[0].originFileObj as File)
          : '';
      let photoPublicUrl: string | null = '';

      if (!rawFile) {
        console.warn('Nessun file selezionato.');
        photoPublicUrl = formValue.imgUrl ?? '';
      } else {
        photoPublicUrl = await this.supabaseService.uploadRecipeImage(rawFile, rawFile.name);
      }

      if (!photoPublicUrl) {
        console.warn('Errore nel caricamento immagine');
      }

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
        imgUrl: photoPublicUrl ?? '',
        notes: formValue.notes,
      };

      if (this.editingRecipe) {
        await this.supabaseService.updateRecipe(this.editedRecipeId ?? -1, recipe);
        this.message.create('success', 'Ricetta aggiornata con successo');
      } else {
        await this.supabaseService.saveNewRecipe(recipe);
        this.message.create('success', 'Ricetta aggiunta con successo');
      }
      this.editingRecipe = false;
      this.editedRecipeId = -1;
      this.selectedRecipePhoto = [];
      await this.getRecipes();
    } else {
      this.message.create('error', 'Form non valido');
      console.warn('Form invalido');
    }
  }

  resetForm(): void {
    this.removeAllFields();
    this.removeAllIngredients();
    this.newRecipeFormGroup.reset();
  }

  get steps(): FormArray {
    return this.newRecipeFormGroup.get('steps') as FormArray;
  }

  addField(e?: MouseEvent): void {
    e?.preventDefault();

    const position = this.steps.length + 1;
    const stepGroup = this.fb.group({
      position: [position],
      description: ['', Validators.required],
    });
    this.steps.push(stepGroup);
  }

  removeField(index: number, e: MouseEvent): void {
    e.preventDefault();

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
    this.steps.clear();
  }

  get ingredients(): FormArray {
    return this.newRecipeFormGroup.get('ingredients') as FormArray;
  }

  addIngredient(e?: MouseEvent): void {
    e?.preventDefault();

    const newIngredient = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
    });
    this.ingredients.push(newIngredient);
  }

  removeIngredient(index: number, e: MouseEvent): void {
    e.preventDefault();

    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  removeAllIngredients() {
    this.ingredients.clear();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    // Previeni la submit e fai upload manualmente
    return false;
  };

  deletePhotoFromForm() {
    this.selectedRecipePhoto = [];
    this.message.success(
      'Foto eliminata correttamente. Ignora quella ancora presente in piccolo nel form (è un bug)',
      {
        nzDuration: 5000,
      },
    );
  }
}
