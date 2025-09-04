import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { InitPageComponent } from './init-page/init-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TrisPageComponent } from './tris-page/tris-page.component';
import { MoviesWishlistComponent } from './movies-wishlist/movies-wishlist.component';
import { RecipeBookComponent } from './recipe-book/recipe-book.component';
import { CustomRoutingGuards } from '../services/routing-guards.service';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { QuizPageComponent } from './quiz-page/quiz-page.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { BookshelfComponent } from './bookshelf/bookshelf.component';
import { TravelBookComponent } from './travel-book/travel-book.component';

export const routes: Routes = [
  { path: '', component: InitPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [CustomRoutingGuards] },
  { path: 'tris', component: TrisPageComponent, canActivate: [CustomRoutingGuards] },
  {
    path: 'movies-wishlist',
    component: MoviesWishlistComponent,
    canActivate: [CustomRoutingGuards],
  },
  { path: 'recipe-book', component: RecipeBookComponent, canActivate: [CustomRoutingGuards] },
  { path: 'recipe-book/:id', component: RecipePageComponent, canActivate: [CustomRoutingGuards] },
  { path: 'stats', component: StatsPageComponent, canActivate: [CustomRoutingGuards] },
  { path: 'quiz', component: QuizPageComponent, canActivate: [CustomRoutingGuards] },
  { path: 'photo-gallery', component: PhotoGalleryComponent, canActivate: [CustomRoutingGuards] },
  { path: 'bookshelf', component: BookshelfComponent, canActivate: [CustomRoutingGuards] },
  { path: 'travel-book', component: TravelBookComponent, canActivate: [CustomRoutingGuards] },
];
