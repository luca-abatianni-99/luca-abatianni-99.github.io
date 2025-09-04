import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { SupabaseService } from '../../services/supabase.service';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-photo-gallery',
  imports: [
    NzRadioModule,
    ReactiveFormsModule,
    CommonModule,
    NzFlexModule,
    NzCarouselModule,
    NzDividerModule,
    NzButtonModule,
    NzImageModule
  ],
  templateUrl: './photo-gallery.component.html',
  styleUrl: './photo-gallery.component.css',
})
export class PhotoGalleryComponent implements OnInit {
  array = [1, 2, 3, 4];
  images: string[] = [];
  effect = 'scrollx';

  constructor(protected supabaseService: SupabaseService) {}

  async ngOnInit() {
    await this.loadImages();
    console.log(this.images)
  }

  async upload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const path = `${Date.now()}-${file.name}`;
    const url = await this.supabaseService.uploadImage(file, path);
    if (url) this.images.unshift(url);
  }

  async loadImages() {
    this.images = await this.supabaseService.listImages();
  }
}
