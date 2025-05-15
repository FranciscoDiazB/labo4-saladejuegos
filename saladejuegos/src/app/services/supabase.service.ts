import { Injectable, signal, Signal } from '@angular/core';
import { AuthResponse, createClient } from '@supabase/supabase-js'
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabaseFunctions = createClient('https://didagcbnjmwdbhqgvlbc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGFnY2Juam13ZGJocWd2bGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDIxMTMsImV4cCI6MjA2MDMxODExM30.LPeNC1gkCkNgpwXPOiFfmqPg2BxZKQ3E7qqlJ5cqWJ4');
    
  currentUser = signal<{email: string;} | null>(null);

  login(email:string, password:string): Observable<AuthResponse>{
    
    const promise = this.supabaseFunctions.auth.signInWithPassword(
      {email, password,});

    return from(promise);
  }

  register(email:string, password:string): Observable<AuthResponse>{

    const promise = this.supabaseFunctions.auth.signUp(
      {email, password,});

    return from(promise);
  }

  async getMessages() {
    return await this.supabaseFunctions.schema('public')
      .from('messages')
      .select('*')
      .order('inserted_at', { ascending: true });
  }

  async getPointsFromGame(game:string){
    let query = this.supabaseFunctions.schema('public')
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

  async sendMessage(text: string, user: string, hour:string) {
    return await this.supabaseFunctions.schema('public').from('messages').insert([
      {
        context: text,
        username: user,
        inserted_at: hour
      },
    ]).then(({data, error}) =>{
      if(error){
        console.log(error.message);
      }
    });
  }

  onNewMessage(callback: (payload: any) => void) {
    return this.supabaseFunctions
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }

  constructor() { }
}
