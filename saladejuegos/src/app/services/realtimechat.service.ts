import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimechatService {

  supaBaseChat = inject(SupabaseService);

  constructor() { }

  async getMessages() {
    return await this.supaBaseChat.supabaseFunctions.schema('public')
      .from('messages')
      .select('*')
      .order('id', { ascending: true });
  }

  async sendMessage(text: string, user: string, hour:string) {
    return await this.supaBaseChat.supabaseFunctions.schema('public').from('messages').insert([
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
    return this.supaBaseChat.supabaseFunctions
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
}
