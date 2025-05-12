import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarddeckService {

  constructor(private http:HttpClient) {
  
  }
  
  getDeck(){
    return this.http.get<any>('https://deckofcardsapi.com/api/deck/new/shuffle/');
  }

  getCard(deckId:string){
    return this.http.get<any>('https://deckofcardsapi.com/api/deck/'+deckId+'/draw/')
  }
}
