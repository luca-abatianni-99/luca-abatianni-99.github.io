import { Component, inject, OnInit } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAlertModule } from 'ng-zorro-antd/alert';

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
    CdkDropList,
    CdkDrag,
    NzIconModule,
    NzInputModule,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzSpaceModule,
    NzAlertModule
  ],
  templateUrl: './movies-wishlist.component.html',
  styleUrl: './movies-wishlist.component.css',
})
export class MoviesWishlistComponent implements OnInit {
  movies: MovieModel[] = [];
  displayMovies: MovieModel[] = [];
  tableLoading: boolean = true

  isSearchVisible = false;
  searchValue = '';

  isModalVisible = false;
  indexEditedMovie: number = -1;
  readonlyMovie: boolean = false;

  formGroupArray: FormGroup[] = [];

  constructor(
    private supabaseService: SupabaseService,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {}

  async ngOnInit() {
    this.tableLoading = true
    await this.getMovies();
    this.tableLoading = false
    this.initForms();
  }

  async getMovies() {
    this.movies = await this.supabaseService.getMovies();
    this.displayMovies = [...this.movies];
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

  showModal(index: number, readonly: boolean): void {
    this.isModalVisible = true;
    this.indexEditedMovie = index;
    this.readonlyMovie = readonly;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isModalVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isModalVisible = false;
  }

  private initForms() {
    this.formGroupArray = this.displayMovies.map(movie =>
      this.fb.group({
        title: [movie.title ?? ''],
        description: [movie.description ?? ''],
        link: [movie.link ?? ''],
        notes: [movie.notes ?? ''],
        score: [movie.score ?? 0],
        seen: [movie.seen ?? false],
      }),
    );
  }

  submitForm(index: number): void {
    console.log(this.formGroupArray[index].valid);
  }

  getControlNames(index: number): string[] {
    return Object.keys(this.formGroupArray[index].controls);
  }

  getScoreEmoji(score: number | undefined) {
    if (!score) return '';
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
}
