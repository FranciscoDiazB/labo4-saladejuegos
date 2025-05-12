import { Component, inject } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  supaBase = inject(SupabaseService);

  constructor(private router:Router){

  }

  redirctoTo(path:string){
    this.router.navigate([path]);
  }

}
