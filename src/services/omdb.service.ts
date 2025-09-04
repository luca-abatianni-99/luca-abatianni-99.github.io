import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {
  private apiUrl = 'https://www.omdbapi.com/';
  private apiKey = 'e59ad6ed'; // 🔑 Inserisci la tua chiave qui

  constructor(private http: HttpClient) {}

  // Ricerca per titolo
  searchByTitle(title: string, year?: string): Observable<any> {
    let params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('t', title);

    if (year) {
      params = params.set('y', year);
    }

    return this.http.get(this.apiUrl, { params });
  }

  // Ricerca per ID IMDb
  searchById(imdbId: string): Observable<any> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('i', imdbId);

    return this.http.get(this.apiUrl, { params });
  }

  // Ricerca multipla (es. elenco di film)
  searchList(query: string): Observable<any> {
    const params = new HttpParams()
      .set('apikey', this.apiKey)
      .set('s', query);

    return this.http.get(this.apiUrl, { params });
  }
}
