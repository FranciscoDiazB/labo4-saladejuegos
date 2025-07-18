import { Component, inject, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { LeaderboardsService } from '../../services/leaderboards.service';
import { r3JitTypeSourceSpan } from '@angular/compiler';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})

export class ResultsComponent implements OnInit {

  leaders:any[] = [];
  top3:any[] = [];
  first:any = '';
  second:any = '';
  third:any = '';
  game!:string;
  showAllScoresFlag:boolean = true;
  playersHangMan:any[] = [];
  playersHigherLower:any[] = [];
  playersTrivia:any[] = [];
  playersShooter:any[] = [];
  allPointsAllPlayer:any[] = [];
  allGames:any[] = [];
  flagHangMan:boolean = false;
  flagHigherLower:boolean = false;
  flagTrivia:boolean = false;
  flagShooter:boolean = false;

  supaBase = inject(SupabaseService)
  supaBaseLeaders = inject(LeaderboardsService);

  ngOnInit(): void {
    this.getAllPointsAllGames();
  }

  async getLeadersFromAGame(game:string){

    this.leaders = await this.supaBaseLeaders.getPointsFromGame(game);
    console.log(this.leaders);
    this.getTop3Player();
  }

  async getAllPointsAllGames(){

    this.playersHangMan = await this.supaBaseLeaders.getPointsFromGame('Ahorcado');
    this.playersHigherLower = await this.supaBaseLeaders.getPointsFromGame('Mayor o Menor');
    this.playersTrivia = await this.supaBaseLeaders.getPointsFromGame('Preguntados');
    this.playersShooter = await this.supaBaseLeaders.getPointsFromGame('Punteria');
  }

  getTop3Player(){
    
    this.top3 = this.leaders.slice(0, 3);

    this.first = this.top3[0];
    this.second = this.top3[1];
    this.third = this.top3[2];

    this.closeRibbons();
  }

  getGame(){
    this.game = this.first.game;
  }

  showRibbons(){

    const element = document.getElementById('firstPlace');
    const element2 = document.getElementById('secondPlace');
    const element3 = document.getElementById('thirdPlace');
    const element4 = document.getElementById('game-h1-id');

    element?.classList.add('open-first-ribbon');
    element2?.classList.add('open-second-ribbon');
    element3?.classList.add('open-third-ribbon');
    element4?.classList.add('open-h1');
  }

  closeRibbons(){
    const element = document.getElementById('firstPlace');
    const element2 = document.getElementById('secondPlace');
    const element3 = document.getElementById('thirdPlace');
    const element4 = document.getElementById('game-h1-id');
    
    setTimeout(() => this.showRibbons(), 400);

    element?.classList.remove('open-first-ribbon');
    element2?.classList.remove('open-second-ribbon');
    element3?.classList.remove('open-third-ribbon');
    element4?.classList.remove('open-h1');
  }

  showAllScores(){

    const scores = document.getElementById('all-scores-id');

    if(this.showAllScoresFlag){
      scores?.classList.add('open-all-scores');
      this.showAllScoresFlag = false;
      return;
    }

    scores?.classList.remove('open-all-scores');
    this.showAllScoresFlag = true;

  }

}
