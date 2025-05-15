import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardsService {

  supaBaseLeader = inject(SupabaseService);

  constructor() { }

  async getPointsFromGame(game:string){
    let query = this.supaBaseLeader.supabaseFunctions.schema('public')
        .from('gamePoints')
        .select('*')
        .order('points' , {ascending : false})

      if(game){
        query = query.eq('game', game);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error al obtener los puntajes:', error);
        return [];
      }
    
      return data;
  }
}
