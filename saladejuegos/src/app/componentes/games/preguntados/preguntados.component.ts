import { Component, inject } from '@angular/core';
import { Character, GameofthronesService} from '../../../services/gameofthrones.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent {

  gotService = inject(GameofthronesService);
  supaBase = inject(SupabaseService);

  characters:Character[] = [];
  characterGuessed:Character[] = [];
  currentCharacter!:Character;
  options:string[] = [];
  correctAnswer:string = '';
  selectedAnswer:string | null = null;
  isCorrect:boolean | null = null;
  notEnoughCharacters:boolean = false;
  lives:number = 5;
  points:number = 0;

  constructor() {}

  ngOnInit(){

    this.getDataAndStartRound();
  }

  getDataAndStartRound(){
    this.gotService.getCharacters().subscribe((data) => {
      this.characters = data;
      this.newRound();
    });
  }

  newRound(){

    console.log(this.characters.length);

    if(this.characters.length >= 4){
      
      this.selectedAnswer = null;
      this.isCorrect = null;
  
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      this.currentCharacter = this.characters[randomIndex];
      this.correctAnswer = this.currentCharacter.fullName;
  
      
      this.characterGuessed.push(this.currentCharacter)
      
      const incorrectOptions = this.characters
      .filter((char) => char.fullName !== this.correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((char) => char.fullName);
      
      this.options = [...incorrectOptions, this.correctAnswer].sort();

      let indexCurrentChar = this.characters.indexOf(this.currentCharacter);
      this.characters.splice(indexCurrentChar, 1);
    }
    else{
      this.notEnoughCharacters = true;
    }

  }

  selectAnswer(option: string){
    this.selectedAnswer = option;

    if(this.correctAnswer === option){
      this.isCorrect = true;
      this.points += 15;
    }
    else{
      this.isCorrect = false;
      this.lives--;
      this.shakeQuestion();
    }
    this.showMessage();
  }

  shakeQuestion(){
    
    const element = document.getElementById('question');

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

  showMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('open-msg');
  }

  closeMessage(){
    const element = document.getElementById("msg");
    element?.classList.remove('open-msg');
  }

  next(){
    this.closeMessage();
    this.newRound();
  }

  restartGame(){
    this.characterGuessed = [];
    this.notEnoughCharacters = false;
    this.lives = 5;
    this.points = 0; 
    this.getDataAndStartRound();
    this.closeMessage();
    this.removeGameSaved();
  }

  saveDataGame(){

    const userLogin = this.supaBase.currentUser()?.email;

    this.supaBase.supabaseFunctions.schema('public').from('gamePoints').insert([{user : userLogin, game: 'Preguntados', points: this.points}]).then(({data, error}) =>{
      if(error){
        console.log("Error al escribir en la BD");
        console.log(this.points)
        console.log(userLogin);
        console.log(error.message);
      }
      else{
      }
    });
    console.log(this.points)
    this.showGameSaved();
  }

  showGameSaved(){
    const element = document.getElementById("game-saved");
    element?.classList.add('open-gameSaved');
  }

  removeGameSaved(){
    const element = document.getElementById("game-saved");
    element?.classList.remove('open-gameSaved');
  }
}
