import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MovieModel, RecipeModel } from '../models/common.models';
const supabaseUrl = 'https://ybewqojaquvmsmdyhpnu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZXdxb2phcXV2bXNtZHlocG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NzA5OTcsImV4cCI6MjA2OTQ0Njk5N30.IlQN5m_d-nx0X01kBMucDH774hyjhiK7kD2fH2AVvq4';
const galleryAccessKeyId = 'd031708b58670e97697e2431855f0ea6';
const galleryAccessKey = 'da728e16e16d7ca6ab321169ba2fde2dc5b4649297f37e37eb1509f6f20d249e';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      supabaseUrl, // sostituisci con il tuo URL Supabase
      supabaseKey,
    );
  }

  async getMovies(): Promise<MovieModel[]> {
    const { data, error } = await this.supabase
      .from('movies-wishlist') // nome della tabella
      .select('*'); // seleziona tutte le colonne

    if (error) {
      console.error('Errore nel recupero dei film:', error.message);
      return [];
    }

    return data || [];
  }

  async saveNewMovie(newMovie: MovieModel) {
    const { data, error } = await this.supabase
      .from('movies-wishlist') // nome della tabella
      .insert([newMovie]);

    if (error) {
      console.error("Errore durante l'inserimento:", error);
    } else {
      console.log('Film inserito con successo:', data);
    }
  }

  async deleteMovie(movieId: number) {
    const { error } = await this.supabase.from('movies-wishlist').delete().eq('id', movieId);

    if (error) {
      console.error('Errore nella cancellazione:', error.message);
    } else {
      console.log('Film eliminato con successo');
    }
  }

  async updateMovie(editedMovie: MovieModel) {
    if (editedMovie && editedMovie.id) {
      const { data, error } = await this.supabase
        .from('movies-wishlist') // nome della tabella
        .update(editedMovie) // oggetto con i campi da aggiornare
        .eq('id', editedMovie.id); // condizione: dove id === recipeId

      if (error) {
        console.error("Errore durante l'aggiornamento:", error);
      } else {
        console.log('Film aggiornato con successo:', data);
      }
    }
  }

  async getRecipes(): Promise<RecipeModel[]> {
    const { data, error } = await this.supabase
      .from('recipe-book') // nome della tabella
      .select('*'); // seleziona tutte le colonne

    if (error) {
      console.error('Errore nel recupero delle ricette:', error.message);
      return [];
    }

    return data || [];
  }

  async saveNewRecipe(newRecipe: RecipeModel) {
    const { data, error } = await this.supabase
      .from('recipe-book') // nome della tabella
      .insert([newRecipe]);

    if (error) {
      console.error("Errore durante l'inserimento:", error);
    } else {
      console.log('Ricetta inserita con successo:', data);
    }
  }

  async deleteRecipe(recipeId: number) {
    const { error } = await this.supabase.from('recipe-book').delete().eq('id', recipeId);

    if (error) {
      console.error('Errore nella cancellazione:', error.message);
    } else {
      console.log('Ricetta eliminata con successo');
    }
  }

  async updateRecipe(recipeId: number, updatedData: Partial<RecipeModel>) {
    if (recipeId) {
      const { data, error } = await this.supabase
        .from('recipe-book') // nome della tabella
        .update(updatedData) // oggetto con i campi da aggiornare
        .eq('id', recipeId); // condizione: dove id === recipeId

      if (error) {
        console.error("Errore durante l'aggiornamento:", error);
      } else {
        console.log('Ricetta aggiornata con successo:', data);
      }
    }
  }

  async uploadImage(file: File, path: string): Promise<string | null> {
    const { data, error } = await this.supabase.storage
      .from('gallery')
      .upload(path, file, { upsert: true });

    if (error) {
      console.error('Upload error', error);
      return null;
    }

    return this.getImageUrl(path);
  }

  getImageUrl(path: string): string {
    return `${supabaseUrl}/storage/v1/object/public/gallery/${path}`;
  }

  async listImages(): Promise<string[]> {
    const { data, error } = await this.supabase.storage.from('gallery').list('', { limit: 100 });
    console.log(data);

    if (error || !data) {
      console.error('List error', error);
      return [];
    }

    return data.map(file => this.getImageUrl(file.name));
  }

  // 📌 Upload immagine nel bucket 'recipes'
  async uploadRecipeImage(file: File, fileName: string): Promise<string | null> {
    const filePath = `${Date.now()}-${fileName}`;

    const { error } = await this.supabase.storage.from('recipes').upload(filePath, file);

    if (error) {
      console.error('Errore upload immagine:', error.message);
      return null;
    }

    // Ottieni URL pubblico
    const { data } = this.supabase.storage.from('recipes').getPublicUrl(filePath);

    return data?.publicUrl ?? null;
  }

  // 📌 Aggiorna il campo imgUrl nella tabella 'recipes'
  async updateRecipeImage(recipeId: number, imgUrl: string) {
    const { error } = await this.supabase.from('recipes').update({ imgUrl }).eq('id', recipeId);

    if (error) {
      console.error('Errore update ricetta:', error.message);
      return false;
    }
    return true;
  }
}
