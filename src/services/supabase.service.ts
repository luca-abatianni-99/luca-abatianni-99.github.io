import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MovieModel, RecipeModel } from '../models/common.models';
const supabaseUrl = 'https://ybewqojaquvmsmdyhpnu.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZXdxb2phcXV2bXNtZHlocG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NzA5OTcsImV4cCI6MjA2OTQ0Njk5N30.IlQN5m_d-nx0X01kBMucDH774hyjhiK7kD2fH2AVvq4';

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
}
