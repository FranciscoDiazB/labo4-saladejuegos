import { Injectable, signal, Signal } from '@angular/core';
import { AuthResponse, createClient, User } from '@supabase/supabase-js'
import { from, Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  public supabaseFunctions = createClient('https://didagcbnjmwdbhqgvlbc.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZGFnY2Juam13ZGJocWd2bGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NDIxMTMsImV4cCI6MjA2MDMxODExM30.LPeNC1gkCkNgpwXPOiFfmqPg2BxZKQ3E7qqlJ5cqWJ4');
    
  currentUser = signal<{email: string;} | null>(null);

  admin = signal<boolean>(false);

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

  async isAdmin(): Promise<boolean> {
    const { data: { user } } = await this.supabaseFunctions.auth.getUser();
    if (!user) return false;

    console.log(user.id);
  
    const { data, error } = await this.supabaseFunctions
      .from('admins')
      .select('*')
      .eq('id_admin', user.id)
      .single();

    console.log('Admin: ', data);
  
    return !!data && data.rol === 'admin';
  }

  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabaseFunctions.auth.getUser();
    return user;
  }

  constructor() { }
}
