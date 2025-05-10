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

  constructor() { }
}
