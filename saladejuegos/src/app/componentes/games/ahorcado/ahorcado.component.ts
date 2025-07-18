import { Component, inject, OnInit } from '@angular/core';
import { PositionLetter } from './position-letter';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../services/supabase.service';
import { WordgeneratorService } from '../../../services/wordgenerator.service';

@Component({
  selector: 'app-ahorcado',
  imports: [CommonModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss'
})
export class AhorcadoComponent implements OnInit{

  randomWord:string = "";
  guessingWords:string[] = ['ERRADO','TRASLADAR','TRONCO','SOL','CINCO','MARCOS','JUSTO','KEVIN','SEKIRO'];
  letterGuessedRight:PositionLetter[] = [];
  countRightLetters:number = 0;
  gameLost:boolean = false;
  gameWon:boolean = false;
  wordGuessedRight!:boolean;
  wrongLetter:boolean = false;
  countWrongAnswers:number = 0;
  points:number = 0;
  randomNumber!:number;
  substractPoints:number = 0;
  letters:string[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ', 
    'z', 'x', 'c', 'v', 'b', 'n', 'm'];
  gameSaved:boolean = false;
  randomWordsGenerated:string[] = [];
  buttonPlay:boolean = false;

  ngOnInit(): void {
    console.log(this.randomWord.length);
    this.getData();
    this.resetFlags();
  }

  constructor(private router: Router){

  }

  supaBase = inject(SupabaseService);
  randomWordService = inject(WordgeneratorService);

  getData(){
    this.randomWordService.getRandomWords().subscribe((data) => {
      this.randomWordsGenerated = data;
      console.log(this.randomWordsGenerated);
    });
  }

  play(){
    this.pickRandomWord();
    console.log(this.randomWord);
    this.buttonPlay = true;
  }

  pickRandomWord(){
    console.log('Array: ' + this.randomWordsGenerated.length);
    
    this.randomNumber =  Math.floor(Math.random() * this.randomWordsGenerated.length);

    for(let i = 0; i < this.randomWordsGenerated.length; i++){

      if(this.randomWordsGenerated[i].length <= 10 && !this.randomWordsGenerated[i].includes(' ')){
          this.randomWord = this.randomWordsGenerated[i];
          console.log(this.randomWord);
          this.randomWordsGenerated.splice(this.randomWordsGenerated.indexOf(this.randomWord), 1);
          this.randomWord = this.randomWord.toUpperCase();
          this.randomWord = this.removeAcentuationSpanish(this.randomWord);
          console.log(this.randomWord);
          return;
      }      
    }
  }

  removeAcentuationSpanish(palabra: string): string {
    return palabra.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
      case 1:
        this.showHideBodyPart('head', true);
        break;
      case 2:
        this.showHideBodyPart('torso', true);
        this.showHideBodyPart('drop1', true);
        break;
      case 3: 
        this.showHideBodyPart('leftarm', true);
        break;
      case 4: 
        this.showHideBodyPart('rightarm', true);
        this.showHideBodyPart('drop2', true);
        break;
      case 5: 
        this.showHideBodyPart('leftleg', true);
        this.modifyHeart(1);
        break;
      case 6: 
        this.showHideBodyPart('rightleg', true);
        this.showHideBodyPart('drop3', true);
        this.modifyHeart(2);
        break;
      case 7: 
        this.showHideBodyPart('leftfoot', true);
        this.modifyHeart(3);
        break;
      case 8:
        this.showHideBodyPart('rightfoot', true);
        this.modifyHeart(4);
        break;
    }

    this.didItWin();
    this.didItLose();
  }

  enableButton(char:string){
    let element = document.getElementById(char) as HTMLButtonElement;
    if(element){
      element.disabled = false;
    }
  }

  enabledKeyboard(){
    this.letters.forEach((char) =>{
      this.enableButton(char);
    })
  }

  saveDataGame(){

    const userLogin = this.supaBase.currentUser()?.email;

    this.supaBase.supabaseFunctions.schema('public').from('gamePoints').insert([{user : userLogin, game: 'Ahorcado', points: this.points}]).then(({data, error}) =>{
      if(error){
        console.log("Error al escribir en la BD");
        console.log(this.points)
        console.log(userLogin);
        console.log(error.message);
      }
      else{
        this.gameSaved = true;
      }
    });
    this.showGameSaved();
  }

  getLetters():string[]{
    return this.randomWord.split('');
  }

  didItLose(){
    if(this.countWrongAnswers == 8){
      this.gameLost = true;
      this.showMessage();
    }
  }

  didItWin(){
    if(this.randomWord.length == this.countRightLetters){
      this.points += 45;
      this.wordGuessedRight = true;
      this.gameWon = true;
      this.showMessage();
    }
  }

  resetValues(){
    this.countRightLetters = 0;
    this.countWrongAnswers = 0;
    this.substractPoints = 0;
    this.points = 0;
    this.letterGuessedRight = [];
  }

  resetFlags(){
    this.wrongLetter = false;
    this.gameLost = false;
    this.gameWon = false;
    this.wordGuessedRight = false;
    this.gameSaved = false;
  }

  modifyHeart(frequency:number){
    
    const element = document.getElementById('heart');
    const element2 = document.getElementById('cracked-heart');

    if(frequency == 0){
      element2?.classList.add('remove-heart');
      element?.classList.remove('remove-heart');
    }

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
      element2?.classList.remove('remove-heart');
      element?.classList.remove('show-heart');
      element?.classList.remove('shake-low');
      element?.classList.remove('shake-medium');
      element?.classList.remove('shake-high');
    }
  }

  showHideBodyPart(bodyPart:string, cond:boolean){

    const element = document.getElementById(bodyPart);

    if(cond){
      element?.classList.add('bodyPart');
    }
    else{
      element?.classList.remove('bodyPart');
    }
  }

  hideAllBodyParts(){
    this.showHideBodyPart('head', false);
    this.showHideBodyPart('torso', false);
    this.showHideBodyPart('leftarm', false);
    this.showHideBodyPart('rightarm', false);
    this.showHideBodyPart('leftleg', false);
    this.showHideBodyPart('rightleg', false);
    this.showHideBodyPart('leftfoot', false);
    this.showHideBodyPart('rightfoot', false);
    this.showHideBodyPart('drop1', false);
    this.showHideBodyPart('drop2', false);
    this.showHideBodyPart('drop3', false);
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
    this.hideAllBodyParts();
    this.modifyHeart(0);
    this.closeMessage();
    this.resetFlags();
    this.resetValues();
    this.enabledKeyboard();
    this.removeGameSaved();
    this.pickRandomWord();
  }

}
