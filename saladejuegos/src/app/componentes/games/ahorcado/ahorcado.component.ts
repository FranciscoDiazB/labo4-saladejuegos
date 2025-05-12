import { Component, inject, OnInit } from '@angular/core';
import { PositionLetter } from './position-letter';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit{

  randomWord:string = "ESTEBAN";
  letterGuessedRight:PositionLetter[] = [];
  countRightLetters:number = 0;
  gameLost:boolean = false;
  gameWon:boolean = false;
  wordGuessedRight!:boolean;
  wrongLetter:boolean = false;
  countWrongAnswers:number = 0;
  points:number = 0;
  substractPoints:number = 0;

  ngOnInit(): void {
    console.log(this.randomWord.length);
    this.resetFlags();
  }

  constructor(private router: Router){

  }

  supaBase = inject(SupabaseService);

  restartGame(){
    this.router.navigate(['restartahor']);
  }

  guessLetter(letter:string){

    this.resetFlags();

    this.wordGuessedRight = false;

    if(this.randomWord.includes(letter)){

      for(let i = 0; this.randomWord.length > i; i++){

        if(this.randomWord[i] == letter){
          
          let newPosition = new PositionLetter(i, letter);

          this.countRightLetters++;
          this.letterGuessedRight.push(newPosition);
          this.points+=10;
        }
      }
    }
    else{
      this.wrongLetter = true;
      this.countWrongAnswers++;
      this.points -= this.substractPoints + 1;
      this.substractPoints++;
    }

    if(this.points < 0){
      this.points = 0;
    }

    switch(this.countWrongAnswers){
      case 5: 
        this.modifyHeart(1);
        break;
      case 6: 
        this.modifyHeart(2);
        break;
      case 7: 
        this.modifyHeart(3);
        break;
      case 8:
        this.modifyHeart(4);
        break;
      default:
        break;
    }

    this.didItWin();
    this.didItLose();

    console.log("Exitos: " + this.countRightLetters)
    console.log("Errores:" + this.countWrongAnswers)
  }

  modifyHeart(frequency:number){
    
    const element = document.getElementById('heart');

    if(frequency == 1){
      element?.classList.add('shake-low');
    }
    else if(frequency == 2){
      element?.classList.add('shake-medium');
    }
    else if(frequency == 3){
      element?.classList.add('shake-high');
    }
    else{
      element?.classList.add('remove-heart');
    }
  }

  showMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('open-msg');
  }

  didItLose(){
    if(this.countWrongAnswers == 8){
      this.gameLost = true;
      this.showMessage();
    }
  }

  didItWin(){
    if(this.randomWord.length == this.countRightLetters){
      this.wordGuessedRight = true;
      this.gameWon = true;
      this.showMessage();
    }
  }

  resetFlags(){
    this.gameLost = false;
    this.gameWon = false;
    this.wordGuessedRight = false;
  }
}
