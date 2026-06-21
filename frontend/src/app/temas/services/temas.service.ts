import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tema } from '../models/tema.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TemasService {
  private apiUrl = `${environment.apiUrl}/api/Temas`;

  constructor(private http: HttpClient) {}

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.apiUrl);
  }

  getTema(id: number): Observable<Tema> {
    return this.http.get<Tema>(`${this.apiUrl}/${id}`);
  }

  createTema(tema: Tema): Observable<Tema> {
    return this.http.post<Tema>(this.apiUrl, tema);
  }

  updateTema(id: number, tema: Tema): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, tema);
  }

  deleteTema(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
