import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { RecipeModel } from '../../models/common.models';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective, NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyComponent } from 'ng-zorro-antd/typography';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { get } from 'lodash';

@Component({
  selector: 'app-recipe-page',
  imports: [
    CommonModule,
    NzTypographyComponent,
    NzFlexModule,
    NzCardModule,
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
    NzGridModule,
    NzImageModule,
    NzListModule,
    NzBadgeModule,
  ],
  templateUrl: './recipe-page.component.html',
  styleUrl: './recipe-page.component.css',
})
export class RecipePageComponent {
  recipeId: number = -1;
  recipe: RecipeModel = {id: -1};
  defaultImageUrl: string = 'assets/img/contorno.png'

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}

  ngOnInit() {
    this.recipeId = +this.route.snapshot.paramMap.get('id')!;
    this.getRecipeById(this.recipeId);
    console.log(this.recipe);
    this.defaultImageUrl = this.getDefaultImageUrl()
  }

  getRecipeById(id: number): any {
    this.recipe = this.recipeService.getRecipeById(id) ?? {id: -1};
  }

  capitalizeFirstLetter(text: string | undefined): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getDefaultImageUrl() {
    if (this.recipe && this.recipe.tags) {
      return `assets/img/${this.recipe.tags}.png`
    } else return ''
  }
}
