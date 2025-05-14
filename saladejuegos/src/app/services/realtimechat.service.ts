import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class RealtimechatService {

  supaBaseChat = inject(SupabaseService);

  constructor() { }

  async sendMessage(chat: string, username: string) {
    return this.supaBaseChat.supabaseFunctions.schema('public').from('chatMessages').insert([{user: username, message: chat}]);
  }

  async getMessages() {
    return this.supaBaseChat.supabaseFunctions.schema('public')
      .from('chatMessages')
      .select('*')
      .order('inserted_at', { ascending: true });
  }

  onNewMessage(callback: (payload: any) => void) {
    return this.supaBaseChat.supabaseFunctions
      .channel('public:chatMessages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chatMessages' },
        (payload) => {
          callback(payload.new);
        }
      )
      .subscribe();
  }

  getUserName(){
    return this.supaBaseChat.currentUser()?.email
  }

}
