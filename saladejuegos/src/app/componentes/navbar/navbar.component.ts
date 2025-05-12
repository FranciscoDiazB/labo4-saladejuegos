import { Component, inject, OnInit } from '@angular/core';
import { RouterLink} from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  supaBase = inject(SupabaseService);

  ngOnInit(): void {
    this.supaBase.supabaseFunctions.auth.onAuthStateChange((event, session) =>{
      
      if(event === 'SIGNED_IN'){
        this.supaBase.currentUser.set({email: session?.user.email!});
      }
      else if(event === 'SIGNED_OUT'){
        this.supaBase.currentUser.set(null);
      }
    })
  }

  async signOutSession(){
    await this.supaBase.supabaseFunctions.auth.signOut();
  }
}
