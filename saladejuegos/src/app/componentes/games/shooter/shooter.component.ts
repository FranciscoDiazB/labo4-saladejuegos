import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy } from '@angular/core';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-shooter',
  imports: [CommonModule],
  templateUrl: './shooter.component.html',
  styleUrl: './shooter.component.scss'
})
export class ShooterComponent implements OnDestroy {

  supaBase = inject(SupabaseService);
  
  points: number = 0;
  targets: { x: number, y: number }[] = [];
  flagGameOver: boolean = false;
  timer: number = 10; 
  countClicks:number = 0;
  flagStartGame:boolean = false;
  interval!:NodeJS.Timeout;

  constructor(){

  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  spawnTarget() {
    
    if (this.flagGameOver){
      return;
    } 

    const target = {
      x: Math.floor(Math.random() * 1200),
      y: Math.floor(Math.random() * 700)
    };

    if(target.x > 400 && target.y > 370){

      this.targets.push(target);
    }

    setTimeout(() => this.spawnTarget(), 100);
  }

  startGame() {
    this.flagStartGame = true;
    this.points = 0;
    this.flagGameOver = false;
    this.spawnTarget();

    this.interval = setInterval(() => {
      
      this.timer--;

      if (this.timer <= 0) {
        this.flagGameOver = true;
        this.targets.length = 0;
        this.showMessage();
        clearInterval(this.interval); 
      }
    }, 1000);

  }

  saveDataGame(){

    const userLogin = this.supaBase.currentUser()?.email;

    this.supaBase.supabaseFunctions.schema('public').from('gamePoints').insert([{user : userLogin, game: 'Punteria', points: this.points}]).then(({data, error}) =>{
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
    this.removeMessage();
  }

  restartGame(){
    window.location.reload();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedX = event.clientX;
    const clickedY = event.clientY;
    console.log(clickedX);
    console.log(clickedY);

    this.targets.forEach((target, index) => {
      if (this.isHit(clickedX, clickedY, target)) {
        this.targets.splice(index, 1); 
        this.points += 10;              
      }
    });
  }

  showMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('open-msg');
  }

  removeMessage(){
    const element = document.getElementById("msg");
    element?.classList.add('close-msg');
  }

  isHit(x: number, y: number, target: { x: number, y: number }): boolean {
    const targetSize = 50; 
    return (
      x >= target.x &&
      x <= target.x + targetSize &&
      y >= target.y &&
      y <= target.y + targetSize
    );
  }
}
