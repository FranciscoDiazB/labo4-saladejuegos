import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Game {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  profile_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class MmobombService {

  
  private apiUrl = 'https://www.mmobomb.com/api1/games?platform=pc'
  
  constructor(private http: HttpClient) {

   }

  getGames():Observable<Game[]>{
    return this.http.get<Game[]>(this.apiUrl);
  }

}
