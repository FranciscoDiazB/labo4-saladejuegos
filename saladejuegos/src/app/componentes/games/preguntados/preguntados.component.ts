import { Component, inject } from '@angular/core';
import { Character, GameofthronesService} from '../../../services/gameofthrones.service';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../services/supabase.service';
import { Game, MmobombService } from '../../../services/mmobomb.service';

@Component({
  selector: 'app-preguntados',
  imports: [CommonModule],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent {

  gotService = inject(GameofthronesService);
  supaBase = inject(SupabaseService);
  gameService = inject(MmobombService);

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
  lowerPoints:number = 0;

  games:Game[] = [];
  gameGuessed:Game[] = [];
  currentGame!:Game;
  notEnoughGames:boolean = false;
  gameSaved:boolean = false;

  constructor() {}

  ngOnInit(){

    this.getDataAndStartRound();
    //this.getDataAndStartRoundGame();
  }

  getDataAndStartRound(){
    this.gotService.getCharacters().subscribe((data) => {
      this.characters = data;
      this.newRound();
    });
  }

  // getDataAndStartRoundGame(){
  //   this.gameService.getGames().subscribe((data)=> {
  //     this.games = data;
  //     this.newRoundGame();
  //   })
  // }

  // newRoundGame(){

  //   if(this.games.length >= 4){
      
  //     this.selectedAnswer = null;
  //     this.isCorrect = null;
  
  //     const randomIndex = Math.floor(Math.random() * this.games.length);
  //     this.currentGame = this.games[randomIndex];
  //     this.correctAnswer = this.currentGame.developer;
  
      
  //     this.gameGuessed.push(this.currentGame);
      
  //     const incorrectOptions = this.games
  //     .filter((game) => game.developer !== this.correctAnswer)
  //     .sort(() => 0.5 - Math.random())
  //     .slice(0, 3)
  //     .map((game) => game.developer);
      
  //     this.options = [...incorrectOptions, this.correctAnswer].sort();

  //     let indexCurrentChar = this.games.indexOf(this.currentGame);
  //     this.games.splice(indexCurrentChar, 1);
  //   }
  //   else{
  //     this.notEnoughGames = true;
  //   }
  // }

  newRound(){

    this.closeImgHolder();
    console.log(this.characters.length);

    if(this.characters.length >= 1){
      
      this.selectedAnswer = null;
      this.isCorrect = null;
  
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      this.currentCharacter = this.characters[randomIndex];
      this.correctAnswer = this.currentCharacter.fullName;

      console.log(this.correctAnswer);
  
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
      this.showMessage();
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
      this.lowerPoints++;
      this.points -= this.lowerPoints;
      this.lives--;
      this.shakeQuestion();
    }
    this.showMessage();

    if(this.points < 0){
      this.points = 0;
    }
  }

  next(){
    this.closeMessage();
    this.newRound();
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
        this.gameSaved = true;
      }
    });
    console.log(this.points)
    this.showGameSaved();
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

  openImgHolder(){
    const element = document.getElementById('image-holder');
    element?.classList.add('open-imgHolder')
  }

  closeImgHolder(){
    const element = document.getElementById('image-holder');

    setTimeout(() => this.openImgHolder(), 200);

    element?.classList.remove('open-imgHolder')
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
    this.characterGuessed = [];
    this.notEnoughCharacters = false;
    this.gameSaved = false;
    this.lives = 5;
    this.points = 0; 
    this.lowerPoints = 0;
    this.getDataAndStartRound();
    this.closeMessage();
    this.removeGameSaved();
  }
}
