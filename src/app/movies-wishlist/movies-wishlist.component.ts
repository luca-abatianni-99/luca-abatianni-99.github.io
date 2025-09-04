import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { MovieModel } from '../../models/common.models';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTableModule } from 'ng-zorro-antd/table';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { OmdbService } from '../../services/omdb.service';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { filter } from 'lodash';
import { NzListModule } from 'ng-zorro-antd/list';

export enum MoviePageStatus {
  NONE,
  VIEWING,
  ADDING,
  EDITING,
}

export enum TabFilter {
  NOT_SEEN,
  SEEN,
}

export type IdAndFormGroupModel = {
  id: number | undefined;
  formGroup: FormGroup;
};

@Component({
  selector: 'app-movies-wishlist',
  imports: [
    NzSplitterModule,
    NzFlexModule,
    CommonModule,
    NzButtonModule,
    NzTypographyModule,
    DragDropModule,
    NzTableModule,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzSpaceModule,
    NzAlertModule,
    NzDividerModule,
    NzFloatButtonModule,
    NzPopconfirmModule,
    NzCheckboxModule,
    NzTabsModule,
    NzListModule,
  ],
  templateUrl: './movies-wishlist.component.html',
  styleUrl: './movies-wishlist.component.css',
})
export class MoviesWishlistComponent implements OnInit, OnDestroy {
  movies: MovieModel[] = [];
  displayMovies: MovieModel[] = [];
  currentFilter: BehaviorSubject<TabFilter> = new BehaviorSubject<TabFilter>(TabFilter.NOT_SEEN);
  tabFilter = TabFilter;

  tableLoading: boolean = true;
  currentStatus: MoviePageStatus = MoviePageStatus.NONE;
  moviePageStatus = MoviePageStatus;

  isSearchVisible = false;
  searchValue = '';

  isModalVisible = false;
  idEditedMovie: number = -1;
  formGroupArray: IdAndFormGroupModel[] = [];
  newMovieFormGroup: FormGroup = new FormGroup({});

  omdbLoading: boolean = false;
  omdbQuery: string = '';
  omdbResponseData: any = [];

  subsToUnsub: Subscription[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private omdbService: OmdbService,
  ) {}

  async ngOnInit() {
    this.tableLoading = true;
    await this.getMovies();
    this.tableLoading = false;

    const filterSub = this.currentFilter.subscribe(filter => {
      console.log(filter);
      this.displayMovies = this.movies
        .filter(movie => movie.seen === this.mapTabFilterToBoolean(filter))
        .sort((a, b) => {
          const idA = a.id ?? -1;
          const idB = b.id ?? -1;
          return idA - idB;
        });
    });
    this.subsToUnsub.push(filterSub);

    this.omdbService.searchByTitle('Inception').subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
    });

    this.omdbService.searchById('tt1375666').subscribe({
      next: data => console.log(data),
      error: err => console.log(err),
    });

    this.searchMoviesOnOmdb();
  }

  ngOnDestroy(): void {
    this.subsToUnsub.forEach(sub => sub.unsubscribe());
    this.subsToUnsub = [];
  }

  async getMovies() {
    this.movies = await this.supabaseService.getMovies();
    this.displayMovies = [...this.movies];
    if (this.currentFilter) {
      this.currentFilter.pipe(take(1)).subscribe(filter => {
        console.log(filter);
        this.displayMovies = this.movies
          .filter(movie => movie.seen === this.mapTabFilterToBoolean(filter))
          .sort((a, b) => {
            const idA = a.id ?? -1;
            const idB = b.id ?? -1;
            return idA - idB;
          });
      });
    }
    this.initForms();
  }

  dropTable(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.displayMovies, event.previousIndex, event.currentIndex);
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.isSearchVisible = false;
    this.displayMovies = this.movies.filter(
      (item: MovieModel) =>
        item.title && item.title.toLowerCase().includes(this.searchValue.toLowerCase()),
    );
  }

  showModal(id: number, readonly: boolean): void {
    this.idEditedMovie = id;
    this.clearOmdbSearch()
    this.isModalVisible = true;
    if (readonly) {
      this.currentStatus = MoviePageStatus.VIEWING;
    } else {
      this.currentStatus = MoviePageStatus.EDITING;
    }
  }

  addNewMovieModal() {
    this.currentStatus = MoviePageStatus.ADDING;
    this.isModalVisible = true;
    this.initNewMovieFormGroup();
  }

  async deleteMovie(movieId: number | undefined) {
    if (movieId) {
      await this.supabaseService.deleteMovie(movieId);
      await this.getMovies();
      this.message.create('success', 'Film eliminato con successo');
    }
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isModalVisible = false;
    if (this.currentStatus === this.moviePageStatus.VIEWING) return;
    if (this.currentStatus === MoviePageStatus.ADDING && this.newMovieFormGroup.valid) {
      this.submitForm(true);
    } else if (
      this.idEditedMovie !== -1 &&
      this.formGroupArray.find(fg => fg.id === this.idEditedMovie)?.formGroup.valid
    ) {
      console.log('Editing movie');
      this.submitForm(false);
    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isModalVisible = false;
    if (this.currentStatus === this.moviePageStatus.VIEWING) return;
    if (this.currentStatus === MoviePageStatus.ADDING) {
      this.currentStatus = MoviePageStatus.NONE;
    } else if (this.idEditedMovie !== -1) {
      this.idEditedMovie = -1;
    }
  }

  private initForms() {
    this.formGroupArray = this.movies.map(movie => {
      return {
        id: movie.id,
        formGroup: this.fb.group({
          title: [movie.title ?? '', [Validators.required]],
          description: [movie.description ?? ''],
          link: [movie.link ?? ''],
          notes: [movie.notes ?? ''],
          score: [movie.score ?? 0],
          seen: [movie.seen ?? false],
          director: [movie.director ?? ''],
          actors: [movie.actors ?? ''],
          released: [movie.released ?? ''],
          genre: [movie.genre ?? ''],
          imdbRating: [movie.imdbRating ?? 0],
          imdbID: [movie.imdbID ?? ''],
          poster: [movie.poster ?? ''],
        }),
      };
    });
  }

  async submitForm(adding: boolean) {
    if (adding) {
      console.log(this.newMovieFormGroup.valid);
      const formValue = this.newMovieFormGroup.value;

      const newMovie: MovieModel = {
        title: formValue.title,
        description: formValue.description,
        link: formValue.link,
        notes: formValue.notes,
        score: formValue.score,
        seen: formValue.seen,
        director: formValue.director,
        actors: formValue.actors,
        released: formValue.released,
        genre: formValue.genre,
        imdbRating: formValue.imdbRating,
        imdbID: formValue.imdbId,
        poster: formValue.poster,
      };

      await this.supabaseService.saveNewMovie(newMovie);
      this.tableLoading = true;
      await this.getMovies();
      this.tableLoading = false;
      this.currentStatus = MoviePageStatus.NONE;
      this.message.create('success', 'Film aggiunto con successo');
    } else {
      console.log(this.formGroupArray.find(fg => fg.id === this.idEditedMovie)?.formGroup.valid);

      const formValue = this.formGroupArray.find(fg => fg.id === this.idEditedMovie)?.formGroup
        .value;

      const editedMovie: MovieModel = {
        id: this.movies.find(mv => mv.id === this.idEditedMovie)?.id,
        title: formValue.title,
        description: formValue.description,
        link: formValue.link,
        notes: formValue.notes,
        score: formValue.score,
        seen: formValue.seen,
        director: formValue.director,
        actors: formValue.actors,
        released: formValue.released,
        genre: formValue.genre,
        imdbRating: formValue.imdbRating,
        imdbID: formValue.imdbId,
        poster: formValue.poster,
      };

      console.log(editedMovie);

      await this.supabaseService.updateMovie(editedMovie);
      this.tableLoading = true;
      await this.getMovies();
      this.tableLoading = false;
      this.idEditedMovie = -1;
      this.currentStatus = MoviePageStatus.NONE;
      this.message.create('success', 'Film modificato con successo');
    }
  }

  getControlNames(id: number): string[] {
    return Object.keys(this.formGroupArray.find(fg => fg.id === id)?.formGroup.controls || {});
  }

  getCurrentEditedMovieFormGroupById() {
    return (
      this.formGroupArray.find(fg => fg.id === this.idEditedMovie)?.formGroup || new FormGroup({})
    );
  }

  getScoreEmoji(score: number | undefined) {
    if (score === undefined || score === null) return '';
    if (score >= 10) return '🤩​';
    if (score < 10 && score >= 8) return '​😍​';
    if (score < 8 && score >= 6) return '☺️';
    if (score < 6 && score >= 4) return '​😳';
    if (score < 4 && score >= 2) return '​😡';
    if (score < 2 && score >= 0) return '​🤢';
    if (score < 0) return '​🤮';
    return '';
  }

  createFilterMessage(): void {
    this.message.info('Filtri attivi sulla tabella');
  }

  initNewMovieFormGroup() {
    this.newMovieFormGroup = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      link: [''],
      notes: [''],
      score: [null],
      seen: [false],
      director: [''],
      actors: [''],
      released: [''],
      genre: [''],
      imdbRating: [0],
      imdbID: [''],
      poster: [''],
    });
  }

  searchMoviesOnOmdb(): void {
    if (!this.omdbQuery.trim()) return;

    this.omdbService.searchList(this.omdbQuery).subscribe({
      next: response => {
        if (response.Response === 'True') {
          console.log(response);
          this.omdbResponseData = response.Search
        } else {
          console.log('nessun film trovato');
        }
      },
      error: err => {
        console.error('errore nella chiamata omdb');
      },
    });
  }

  clearOmdbSearch() {
    this.omdbQuery = ''
    this.omdbResponseData = []
  }

  mapTabFilterToBoolean(filter: TabFilter) {
    return filter === TabFilter.SEEN;
  }

}
