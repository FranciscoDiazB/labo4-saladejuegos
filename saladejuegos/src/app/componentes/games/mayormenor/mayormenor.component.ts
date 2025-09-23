import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CarddeckService } from '../../../services/carddeck.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-mayormenor',
  imports: [CommonModule],
  templateUrl: './mayormenor.component.html',
  styleUrl: './mayormenor.component.scss'
})
export class MayormenorComponent implements OnInit {

  deck = inject(CarddeckService);
  supaBase = inject(SupabaseService);

  deckId:string = '';
  currentCard:any;
  score:number = 0;
  message:string = '';
  isGameOver:boolean = false;
  lives:number = 5;
  lowerScore:number = 0;
  noRemainigCards:boolean = false;
  gameSaved:boolean = false;

  constructor(){}

  ngOnInit(): void {

    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.message = '';
    this.isGameOver = false;
    this.deck.getDeck().subscribe((data: any) => {
      this.deckId = data.deck_id;
      this.drawInitialCard();
    });
  }

  drawInitialCard() {
    this.deck.getCard(this.deckId).subscribe((data: any) => {
      this.currentCard = data.cards[0];
      this.showCard();
    });
  }

  guess(higher: boolean) {

    if(this.lives > 0){

      this.closeCard();
      
      this.deck.getCard(this.deckId).subscribe((data: any) => {
        
        const nextCard = data.cards[0];
        console.log(nextCard);
        
        const remaining = data.remaining;

        if(remaining == 1){
          this.noRemainigCards = true;
          console.log(this.noRemainigCards);
          this.isGameOver = true;
          this.showMessage();
          this.saveDataGame();
        }

        console.log(remaining);
        
        const currentValue = this.getCardValue(this.currentCard.value);
        const nextValue = this.getCardValue(nextCard.value);

        if (nextValue === currentValue) {
          this.message = 'Empate';
          this.currentCard = nextCard;
          return;
        }
  
        const correct = higher ? nextValue > currentValue : nextValue < currentValue;
  
        if (correct) {
          this.score+=7;
          this.message = 'Correcto';
        } else {
          this.message = 'Fallaste';
          this.lowerScore++;
          this.score-=this.lowerScore;
          this.lives--;
          this.shakeHearts();
          if(this.lives == 0){
            this.isGameOver = true;
            this.showMessage();
            this.saveDataGame();
          }
        }
        if(this.score < 0){
          this.score = 0;
        }
        this.currentCard = nextCard;
      });
    }
    else{
      this.showMessage();
    }
  }

  getCardValue(value: string): number {
    const cardMap: any = {
      'ACE': 14,
      'KING': 13,
      'QUEEN': 12,
      'JACK': 11
    };
    return cardMap[value] || parseInt(value);
  }

  saveDataGame(){

    const userLogin = this.supaBase.currentUser()?.email;

    this.supaBase.supabaseFunctions.schema('public').from('gamePoints').insert([{user : userLogin, game: 'Mayor o Menor', points: this.score}]).then(({data, error}) =>{
      if(error){
        console.log("Error al escribir en la BD");
        console.log(this.score)
        console.log(userLogin);
        console.log(error.message);
      }
      else{
        this.gameSaved = true;
      }
    });
    console.log(this.score)
    this.showGameSaved();
  }

  shakeHearts(){
    
    const element = document.getElementById('heart');

    switch(this.lives){

      case 1: 
        element?.classList.add('one-left');
        break;
      case 2:
        element?.classList.add('two-left');
        break;
      case 3:
        element?.classList.add('three-left');
        break;
      case 4:
        element?.classList.add('four-left'); 
        break;
      case 0:
        element?.classList.remove('one-left');
        element?.classList.remove('two-left');
        element?.classList.remove('three-left');
        element?.classList.remove('four-left');
        break;

    }
  }

  showCard(){
    const element = document.getElementById('card');
    element?.classList.add('open-card')
  }

  closeCard(){
    const element = document.getElementById('card');

    setTimeout(() => this.showCard(), 400);

    element?.classList.remove('open-card')
  }

  showMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('open-msg');
  }

  closeMessage(){
    const element = document.getElementById("msg");
    element?.classList.remove('open-msg');
  }

  showGameSaved(){
    const element = document.getElementById("game-saved");
    element?.classList.add('open-gameSaved');
  }

  removeGameSaved(){
    const element = document.getElementById("game-saved");
    element?.classList.remove('open-gameSaved');
  }

  restartGame(){
    this.lives = 5;
    this.lowerScore = 0;
    this.gameSaved = false;
    this.isGameOver = false;
    this.noRemainigCards = false;
    this.startGame();
    this.closeMessage();
    this.removeGameSaved();
  }
}
