import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink} from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit{

  supaBase = inject(SupabaseService);

  isAdmin = false;
  adminPosta:boolean = false;

  constructor(private router:Router){

  }

  async ngOnInit(){

    this.supaBase.supabaseFunctions.auth.onAuthStateChange((event, session) =>{
      
      if(event === 'SIGNED_IN'){
        this.supaBase.currentUser.set({email: session?.user.email!});

        this.supaBase.isAdmin().then(isAdmin => {
          this.supaBase.admin.set(isAdmin);
          console.log('Es admin?', isAdmin);
          this.adminPosta = isAdmin;
        });

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
