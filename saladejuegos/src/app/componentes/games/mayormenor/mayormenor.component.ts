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

  deckId: string = '';
  currentCard: any;
  score: number = 0;
  message: string = '';
  isGameOver: boolean = false;
  lives:number = 5;
  lowerScore:number = 0;

  ngOnInit(): void {

    this.startGame();
  }

  startGame() {
    this.score = 0;
    this.message = '';
    this.isGameOver = false;

    this.deck.getDeck().subscribe((res: any) => {
      this.deckId = res.deck_id;
      this.drawInitialCard();
    });
  }

  drawInitialCard() {
    this.deck.getCard(this.deckId).subscribe((res: any) => {
      this.currentCard = res.cards[0];
    });
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

  guess(higher: boolean) {

    if(this.lives > 0){
      
      this.deck.getCard(this.deckId).subscribe((res: any) => {
        const nextCard = res.cards[0];
  
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
          this.message = '¡Correcto!';
        } else {
          this.message = '¡Fallaste!';
          this.lowerScore++;
          this.score-=this.lowerScore;
          this.lives--;
          this.shakeHearts();
          if(this.lives == 0){
            this.isGameOver = true;
            this.showMessage();
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

  showMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('open-msg');
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

  constructor(){

  }
}
