import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordgeneratorService {

  private apiUrl = 'https://random-word-api.herokuapp.com/word?number=42&lang=es';

  constructor(private http:HttpClient) {

  }

  getRandomWords(): Observable<string[]>{
    return this.http.get<string[]>(this.apiUrl);
  }

}
