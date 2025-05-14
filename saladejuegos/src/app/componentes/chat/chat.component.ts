import { AfterViewChecked, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy{

  messages: any[] = [];
  newMessage = '';
  subscription: any;
  condition:boolean = true;
  time!:Date;
  exactTime:string = '';

  @ViewChild('chatBox') private chatBox!: ElementRef;

  supabase = inject(SupabaseService);

  constructor() {}

  async ngOnInit() {
    const { data, error } = await this.supabase.getMessages();
    if (error) {
      console.error('Error loading messages', error);
    } else {
      this.messages = data || [];
      setTimeout(() => this.scrollToBottom(), 0);
    }

    this.subscription = this.supabase.onNewMessage((msg) => {
      this.messages.push(msg);
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  private scrollToBottom() {
    if (this.chatBox) {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    }
  }

  async sendMessage() {

    this.time = new Date();

    this.exactTime = this.time.getHours().toString() + ':';

    if(this.time.getMinutes().toString().length < 2){
      this.exactTime += '0';
    }

    this.exactTime += this.time.getMinutes().toString();

    const user = this.supabase.currentUser();

    if(!user){
      console.log('Error');
      return
    }
 
    if (this.newMessage.trim()) {
      await this.supabase.sendMessage(this.newMessage, user.email, this.exactTime);
      this.newMessage = '';
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  openCloseChat(){
  
    const element = document.getElementById('chat');

    if(this.condition){
      element?.classList.add('open-chat');
      this.condition = false
      return
    }

    element?.classList.remove('open-chat');
    this.condition = true;
    return;
  }

  

}
