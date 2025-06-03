import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  supaBase = inject(SupabaseService);

  constructor(private router:Router){

  }

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

  redirctoTo(path:string){

    path = 'games/' + path;

    this.router.navigate([path]);
  }

  async signOutSession(){

    const { error } = await this.supaBase.supabaseFunctions.auth.signOut();
    if (!error) {
      console.log('Cierre de sesión exitoso');
      this.router.navigate(['/login']);
    } else {
      console.error('Error al cerrar sesión:', error);
    }
  }


}
